import "server-only";

import {
  abandonReminderJob,
  claimDueReminderJobs,
  getNextNotificationAt,
  getPushSubscriptionsByUser,
  releaseReminderJob,
  removePushSubscriptionByEndpoint,
} from "@/lib/reminders";
import { sendWebPushNotification } from "@/lib/push";

type ReminderWorkerResult = {
  claimed: number;
  processed: number;
  notified: number;
  removedSubscriptions: number;
  failures: number;
};

function buildNotificationBody(remindAtIso: string) {
  const remindAt = new Date(remindAtIso);

  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(remindAt);
}

function isExpiredPushError(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error &&
    typeof error.statusCode === "number"
  ) {
    return error.statusCode === 404 || error.statusCode === 410;
  }

  return false;
}

export async function processDueReminderNotifications(limit = 20) {
  const jobs = await claimDueReminderJobs(limit);
  const result: ReminderWorkerResult = {
    claimed: jobs.length,
    processed: 0,
    notified: 0,
    removedSubscriptions: 0,
    failures: 0,
  };

  for (const job of jobs) {
    try {
      const subscriptions = await getPushSubscriptionsByUser(job.reminder.userId);
      let pushCount = 0;

      for (const subscription of subscriptions) {
        try {
          await sendWebPushNotification(
            {
              endpoint: subscription.endpoint,
              expirationTime: subscription.expirationTime,
              keys: subscription.keys,
            },
            {
              title: job.reminder.title,
              body: `Pendiente desde ${buildNotificationBody(job.reminder.remindAt)}`,
              tag: `reminder:${job.reminder.id}`,
              url: "/recordatorios/dashboard?filter=pending",
            },
          );
          pushCount += 1;
        } catch (error) {
          if (isExpiredPushError(error)) {
            await removePushSubscriptionByEndpoint(subscription.endpoint);
            result.removedSubscriptions += 1;
            continue;
          }

          throw error;
        }
      }

      const firedAt = new Date();
      await releaseReminderJob(job.reminder.id, job.lockId, {
        lastNotifiedAt: firedAt,
        nextNotificationAt: getNextNotificationAt(
          firedAt,
          job.reminder.repeatIntervalMinutes,
        ),
      });

      result.processed += 1;
      result.notified += pushCount;
    } catch (error) {
      result.failures += 1;
      await abandonReminderJob(job.reminder.id, job.lockId);
      console.error("Failed to process reminder notification", error);
    }
  }

  return result;
}
