import "server-only";

import type { Collection, WithId } from "mongodb";

import { getDatabase } from "@/lib/mongodb";
import {
  profileGlobalSettingsSchema,
  type Branch,
  type ProfileGlobalSettings,
} from "@/lib/profile-global-settings-schema";

const PROFILE_GLOBAL_SETTINGS_COLLECTION = "profileGlobalSettings";
const GLOBAL_PROFILE_SETTINGS_KEY = "global";

type ProfileGlobalSettingsDocument = {
  key: string;
  websiteUrl: string;
  instagramUrl: string;
  branches: Branch[];
  updatedAt: Date;
  createdAt: Date;
};

let indexesPromise: Promise<void> | undefined;

async function getProfileGlobalSettingsCollection(): Promise<
  Collection<ProfileGlobalSettingsDocument>
> {
  const db = await getDatabase();
  const collection = db.collection<ProfileGlobalSettingsDocument>(
    PROFILE_GLOBAL_SETTINGS_COLLECTION,
  );

  indexesPromise ??= collection
    .createIndex(
      { key: 1 },
      { unique: true, name: "profile_global_settings_key_unique" },
    )
    .then(() => undefined);

  await indexesPromise;

  return collection;
}

function serializeProfileGlobalSettings(
  settings: WithId<ProfileGlobalSettingsDocument> | null,
): ProfileGlobalSettings {
  if (!settings) {
    return {
      websiteUrl: "",
      instagramUrl: "",
      branches: [],
    };
  }

  return profileGlobalSettingsSchema.parse({
    websiteUrl: settings.websiteUrl ?? "",
    instagramUrl: settings.instagramUrl ?? "",
    branches: settings.branches ?? [],
  });
}

export async function getProfileGlobalSettings() {
  const collection = await getProfileGlobalSettingsCollection();
  const settings = await collection.findOne({ key: GLOBAL_PROFILE_SETTINGS_KEY });

  return serializeProfileGlobalSettings(settings);
}

export async function updateProfileGlobalSettings(input: ProfileGlobalSettings) {
  const data = profileGlobalSettingsSchema.parse(input);
  const collection = await getProfileGlobalSettingsCollection();
  const now = new Date();

  await collection.updateOne(
    { key: GLOBAL_PROFILE_SETTINGS_KEY },
    {
      $set: {
        websiteUrl: data.websiteUrl,
        instagramUrl: data.instagramUrl,
        branches: data.branches,
        updatedAt: now,
      },
      $setOnInsert: {
        key: GLOBAL_PROFILE_SETTINGS_KEY,
        createdAt: now,
      },
    },
    { upsert: true },
  );

  const updated = await collection.findOne({ key: GLOBAL_PROFILE_SETTINGS_KEY });

  return serializeProfileGlobalSettings(updated);
}
