import "server-only";

import type { Collection, WithId } from "mongodb";

import {
  catalogSettingsSchema,
  type CatalogItem,
  type CatalogSettings,
} from "@/lib/catalog-schema";
import { getDatabase } from "@/lib/mongodb";

const CATALOG_COLLECTION = "catalogSettings";
const GLOBAL_CATALOG_KEY = "global";

type CatalogSettingsDocument = {
  key: string;
  items: CatalogItem[];
  updatedAt: Date;
  createdAt: Date;
};

let indexesPromise: Promise<void> | undefined;

async function getCatalogCollection(): Promise<Collection<CatalogSettingsDocument>> {
  const db = await getDatabase();
  const collection = db.collection<CatalogSettingsDocument>(CATALOG_COLLECTION);

  indexesPromise ??= collection
    .createIndex({ key: 1 }, { unique: true, name: "catalog_settings_key_unique" })
    .then(() => undefined);

  await indexesPromise;

  return collection;
}

function serializeCatalogSettings(
  settings: WithId<CatalogSettingsDocument> | null,
): CatalogSettings {
  if (!settings) {
    return { items: [] };
  }

  return catalogSettingsSchema.parse({
    items: settings.items ?? [],
  });
}

export async function getCatalogSettings() {
  const collection = await getCatalogCollection();
  const settings = await collection.findOne({ key: GLOBAL_CATALOG_KEY });

  return serializeCatalogSettings(settings);
}

export async function updateCatalogSettings(input: CatalogSettings) {
  const data = catalogSettingsSchema.parse(input);
  const collection = await getCatalogCollection();
  const now = new Date();

  await collection.updateOne(
    { key: GLOBAL_CATALOG_KEY },
    {
      $set: {
        items: data.items,
        updatedAt: now,
      },
      $setOnInsert: {
        key: GLOBAL_CATALOG_KEY,
        createdAt: now,
      },
    },
    { upsert: true },
  );

  const updated = await collection.findOne({ key: GLOBAL_CATALOG_KEY });

  return serializeCatalogSettings(updated);
}
