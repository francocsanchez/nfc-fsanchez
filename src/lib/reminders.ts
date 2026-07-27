import "server-only";

import {
  MongoServerError,
  ObjectId,
  type Collection,
  type WithId,
} from "mongodb";
import { z } from "zod";

import { getDatabase } from "@/lib/mongodb";
import type { PushSubscriptionPayload } from "@/lib/push";
import {
  combineReminderDateTime,
  createReminderSchema,
  formatReminderZodError,
  splitReminderDateTime,
  type CreateReminderInput,
  type ReminderIntervalMinutes,
  type TaskReminder,
  type TaskReminderStatus,
  type UpdateReminderInput,
  updateReminderSchema,
} from "@/lib/reminder-schema";

const TASK_REMINDERS_COLLECTION = "task_reminders";
const PUSH_SUBSCRIPTIONS_COLLECTION = "push_subscriptions";

type ReminderDocument = {
  userId: string;
  title: string;
  description: string;
  remindAt: Date;
  repeatIntervalMinutes: ReminderIntervalMinutes;
  status: TaskReminderStatus;
  completedAt: Date | null;
  lastNotifiedAt: Date | null;
  nextNotificationAt: Date | null;
  notificationLockId?: string;
  notificationLockExpiresAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type PushSubscriptionDocument = {
  userId: string;
  endpoint: string;
  expirationTime: number | null;
  keys: {
    p256dh: string;
    auth: string;
  };
  userAgent: string;
  lastSeenAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type PushSubscriptionRecord = {
  id: string;
  userId: string;
  endpoint: string;
  expirationTime: number | null;
  keys: {
    p256dh: string;
    auth: string;
  };
  userAgent: string;
  lastSeenAt: string;
  createdAt: string;
  updatedAt: string;
};

export type ClaimedReminderJob = {
  lockId: string;
  reminder: TaskReminder;
};

let reminderIndexesPromise: Promise<void> | undefined;
let pushIndexesPromise: Promise<void> | undefined;

async function getRemindersCollection(): Promise<Collection<ReminderDocument>> {
  const db = await getDatabase();
  const collection = db.collection<ReminderDocument>(TASK_REMINDERS_COLLECTION);

  reminderIndexesPromise ??= Promise.all([
    collection.createIndex(
      { userId: 1, status: 1, remindAt: -1 },
      { name: "task_reminders_user_status_remindAt" },
    ),
    collection.createIndex(
      { status: 1, nextNotificationAt: 1 },
      { name: "task_reminders_status_nextNotificationAt" },
    ),
    collection.createIndex(
      { notificationLockExpiresAt: 1 },
      { name: "task_reminders_notification_lock" },
    ),
  ]).then(() => undefined);

  await reminderIndexesPromise;

  return collection;
}

async function getPushSubscriptionsCollection(): Promise<
  Collection<PushSubscriptionDocument>
> {
  const db = await getDatabase();
  const collection = db.collection<PushSubscriptionDocument>(
    PUSH_SUBSCRIPTIONS_COLLECTION,
  );

  pushIndexesPromise ??= Promise.all([
    collection.createIndex(
      { endpoint: 1 },
      { unique: true, name: "push_subscriptions_endpoint_unique" },
    ),
    collection.createIndex(
      { userId: 1, updatedAt: -1 },
      { name: "push_subscriptions_user_updatedAt" },
    ),
  ]).then(() => undefined);

  await pushIndexesPromise;

  return collection;
}

function parseObjectId(id: string) {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  return new ObjectId(id);
}

function serializeReminder(reminder: WithId<ReminderDocument>): TaskReminder {
  const parts = splitReminderDateTime(reminder.remindAt);

  return {
    id: reminder._id.toHexString(),
    userId: reminder.userId,
    title: reminder.title,
    description: reminder.description ?? "",
    date: parts.date,
    time: parts.time,
    remindAt: reminder.remindAt.toISOString(),
    repeatIntervalMinutes: reminder.repeatIntervalMinutes ?? null,
    status: reminder.status,
    completedAt: reminder.completedAt?.toISOString() ?? null,
    lastNotifiedAt: reminder.lastNotifiedAt?.toISOString() ?? null,
    nextNotificationAt: reminder.nextNotificationAt?.toISOString() ?? null,
    createdAt: reminder.createdAt.toISOString(),
    updatedAt: reminder.updatedAt.toISOString(),
  };
}

function serializePushSubscription(
  subscription: WithId<PushSubscriptionDocument>,
): PushSubscriptionRecord {
  return {
    id: subscription._id.toHexString(),
    userId: subscription.userId,
    endpoint: subscription.endpoint,
    expirationTime: subscription.expirationTime ?? null,
    keys: subscription.keys,
    userAgent: subscription.userAgent ?? "",
    lastSeenAt: subscription.lastSeenAt.toISOString(),
    createdAt: subscription.createdAt.toISOString(),
    updatedAt: subscription.updatedAt.toISOString(),
  };
}

function normalizeReminderInput(
  input: CreateReminderInput | UpdateReminderInput,
  currentStatus?: TaskReminderStatus,
) {
  const remindAt = combineReminderDateTime(input.date, input.time);

  if (Number.isNaN(remindAt.getTime())) {
    throw new z.ZodError([
      {
        code: "custom",
        path: ["date"],
        message: "Ingresa una fecha y hora validas.",
      },
    ]);
  }

  const nextStatus =
    ("status" in input ? input.status : undefined) ?? currentStatus ?? "pending";
  const repeatIntervalMinutes = input.alertIntervalMinutes ?? null;

  return {
    title: input.title.trim(),
    description: input.description ?? "",
    remindAt,
    repeatIntervalMinutes,
    status: nextStatus,
  };
}

function buildReminderUpdateDocument(
  input: UpdateReminderInput,
  existing: WithId<ReminderDocument>,
) {
  const normalized = normalizeReminderInput(input, existing.status);
  const now = new Date();
  const nextNotificationAt =
    normalized.status === "completed" ? null : normalized.remindAt;

  return {
    title: normalized.title,
    description: normalized.description,
    remindAt: normalized.remindAt,
    repeatIntervalMinutes: normalized.repeatIntervalMinutes,
    status: normalized.status,
    completedAt: normalized.status === "completed" ? now : null,
    nextNotificationAt,
    updatedAt: now,
  };
}

function isDuplicateKeyError(error: unknown) {
  return error instanceof MongoServerError && error.code === 11000;
}

export { formatReminderZodError };

export async function listRemindersByUser(userId: string) {
  const collection = await getRemindersCollection();
  const reminders = await collection
    .find({ userId })
    .sort({ status: 1, remindAt: 1, createdAt: -1 })
    .toArray();

  return reminders.map(serializeReminder);
}

export async function getReminderByIdForUser(userId: string, id: string) {
  const objectId = parseObjectId(id);

  if (!objectId) {
    return null;
  }

  const collection = await getRemindersCollection();
  const reminder = await collection.findOne({ _id: objectId, userId });

  return reminder ? serializeReminder(reminder) : null;
}

export async function createReminder(userId: string, input: CreateReminderInput) {
  const data = createReminderSchema.parse(input);
  const normalized = normalizeReminderInput(data);
  const collection = await getRemindersCollection();
  const now = new Date();

  const document: ReminderDocument = {
    userId,
    title: normalized.title,
    description: normalized.description,
    remindAt: normalized.remindAt,
    repeatIntervalMinutes: normalized.repeatIntervalMinutes,
    status: "pending",
    completedAt: null,
    lastNotifiedAt: null,
    nextNotificationAt: normalized.remindAt,
    createdAt: now,
    updatedAt: now,
  };

  const result = await collection.insertOne(document);
  const created = await collection.findOne({ _id: result.insertedId, userId });

  if (!created) {
    throw new Error("Reminder was created but could not be loaded.");
  }

  return serializeReminder(created);
}

export async function updateReminder(
  userId: string,
  id: string,
  input: UpdateReminderInput,
) {
  const objectId = parseObjectId(id);

  if (!objectId) {
    return null;
  }

  const data = updateReminderSchema.parse(input);
  const collection = await getRemindersCollection();
  const existing = await collection.findOne({ _id: objectId, userId });

  if (!existing) {
    return null;
  }

  const update = buildReminderUpdateDocument(data, existing);

  await collection.updateOne(
    { _id: objectId, userId },
    {
      $set: update,
      $unset: {
        notificationLockId: "",
        notificationLockExpiresAt: "",
      },
    },
  );

  const updated = await collection.findOne({ _id: objectId, userId });

  return updated ? serializeReminder(updated) : null;
}

export async function setReminderStatus(
  userId: string,
  id: string,
  status: TaskReminderStatus,
) {
  const objectId = parseObjectId(id);

  if (!objectId) {
    return null;
  }

  const collection = await getRemindersCollection();
  const existing = await collection.findOne({ _id: objectId, userId });

  if (!existing) {
    return null;
  }

  const now = new Date();

  await collection.updateOne(
    { _id: objectId, userId },
    {
      $set: {
        status,
        completedAt: status === "completed" ? now : null,
        nextNotificationAt: status === "completed" ? null : existing.remindAt,
        updatedAt: now,
      },
      $unset: {
        notificationLockId: "",
        notificationLockExpiresAt: "",
      },
    },
  );

  const updated = await collection.findOne({ _id: objectId, userId });

  return updated ? serializeReminder(updated) : null;
}

export async function deleteReminder(userId: string, id: string) {
  const objectId = parseObjectId(id);

  if (!objectId) {
    return false;
  }

  const collection = await getRemindersCollection();
  const result = await collection.deleteOne({ _id: objectId, userId });

  return result.deletedCount === 1;
}

export async function upsertPushSubscription(
  userId: string,
  subscription: PushSubscriptionPayload,
  userAgent = "",
) {
  const collection = await getPushSubscriptionsCollection();
  const now = new Date();

  try {
    await collection.updateOne(
      { endpoint: subscription.endpoint },
      {
        $set: {
          userId,
          endpoint: subscription.endpoint,
          expirationTime: subscription.expirationTime ?? null,
          keys: subscription.keys,
          userAgent,
          lastSeenAt: now,
          updatedAt: now,
        },
        $setOnInsert: {
          createdAt: now,
        },
      },
      { upsert: true },
    );
  } catch (error) {
    if (!isDuplicateKeyError(error)) {
      throw error;
    }

    await collection.updateOne(
      { endpoint: subscription.endpoint },
      {
        $set: {
          userId,
          expirationTime: subscription.expirationTime ?? null,
          keys: subscription.keys,
          userAgent,
          lastSeenAt: now,
          updatedAt: now,
        },
      },
    );
  }

  const stored = await collection.findOne({ endpoint: subscription.endpoint });

  if (!stored) {
    throw new Error("Push subscription was saved but could not be loaded.");
  }

  return serializePushSubscription(stored);
}

export async function deletePushSubscription(userId: string, endpoint: string) {
  const collection = await getPushSubscriptionsCollection();
  const result = await collection.deleteOne({ userId, endpoint });

  return result.deletedCount === 1;
}

export async function listPushSubscriptionsByUser(userId: string) {
  const collection = await getPushSubscriptionsCollection();
  const subscriptions = await collection.find({ userId }).toArray();

  return subscriptions.map(serializePushSubscription);
}

export async function removePushSubscriptionByEndpoint(endpoint: string) {
  const collection = await getPushSubscriptionsCollection();

  await collection.deleteOne({ endpoint });
}

export async function getPushSubscriptionsByUser(userId: string) {
  const collection = await getPushSubscriptionsCollection();

  return collection.find({ userId }).toArray();
}

export async function claimDueReminderJobs(limit = 20) {
  const collection = await getRemindersCollection();
  const jobs: ClaimedReminderJob[] = [];
  const now = new Date();

  for (let index = 0; index < limit; index += 1) {
    const lockId = new ObjectId().toHexString();
    const claimed = await collection.findOneAndUpdate(
      {
        status: "pending",
        nextNotificationAt: { $ne: null, $lte: now },
        $or: [
          { notificationLockExpiresAt: null },
          { notificationLockExpiresAt: { $exists: false } },
          { notificationLockExpiresAt: { $lte: now } },
        ],
      },
      {
        $set: {
          notificationLockId: lockId,
          notificationLockExpiresAt: new Date(now.getTime() + 5 * 60 * 1000),
        },
      },
      {
        sort: { nextNotificationAt: 1, remindAt: 1 },
        returnDocument: "after",
      },
    );

    if (!claimed) {
      break;
    }

    jobs.push({
      lockId,
      reminder: serializeReminder(claimed),
    });
  }

  return jobs;
}

export async function releaseReminderJob(
  id: string,
  lockId: string,
  updates: {
    lastNotifiedAt?: Date | null;
    nextNotificationAt?: Date | null;
    status?: TaskReminderStatus;
    completedAt?: Date | null;
  },
) {
  const objectId = parseObjectId(id);

  if (!objectId) {
    return false;
  }

  const collection = await getRemindersCollection();
  const now = new Date();
  const result = await collection.updateOne(
    {
      _id: objectId,
      notificationLockId: lockId,
    },
    {
      $set: {
        updatedAt: now,
        ...updates,
      },
      $unset: {
        notificationLockId: "",
        notificationLockExpiresAt: "",
      },
    },
  );

  return result.modifiedCount === 1;
}

export async function abandonReminderJob(id: string, lockId: string) {
  const objectId = parseObjectId(id);

  if (!objectId) {
    return false;
  }

  const collection = await getRemindersCollection();
  const result = await collection.updateOne(
    {
      _id: objectId,
      notificationLockId: lockId,
    },
    {
      $unset: {
        notificationLockId: "",
        notificationLockExpiresAt: "",
      },
    },
  );

  return result.modifiedCount === 1;
}

export function getNextNotificationAt(
  baseDate: Date,
  repeatIntervalMinutes: ReminderIntervalMinutes,
) {
  if (!repeatIntervalMinutes) {
    return null;
  }

  return new Date(baseDate.getTime() + repeatIntervalMinutes * 60 * 1000);
}
