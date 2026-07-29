import "server-only";

import {
  type Collection,
  type Filter,
  type OptionalUnlessRequiredId,
  type WithId,
} from "mongodb";

import { getDatabase } from "@/lib/mongodb";

const CREDENTIAL_METRICS_COLLECTION = "credenciales_metricas";
const BUENOS_AIRES_TIMEZONE = "America/Buenos_Aires";

export type CredentialMetricEvent = "save_contact" | "whatsapp";

export type CredentialMetricDocument = {
  slug: string;
  anio: number;
  mes: number;
  saveContactClicks: number;
  whatsappClicks: number;
  createdAt: Date;
  updatedAt: Date;
};

export type CredentialMetric = {
  slug: string;
  anio: number;
  mes: number;
  saveContactClicks: number;
  whatsappClicks: number;
  createdAt: string;
  updatedAt: string;
};

let indexesPromise: Promise<void> | undefined;

async function getCredentialMetricsCollection(): Promise<
  Collection<CredentialMetricDocument>
> {
  const db = await getDatabase();
  const collection = db.collection<CredentialMetricDocument>(
    CREDENTIAL_METRICS_COLLECTION,
  );

  indexesPromise ??= collection
    .createIndex(
      { slug: 1, anio: 1, mes: 1 },
      {
        unique: true,
        name: "credenciales_metricas_slug_anio_mes_unique",
      },
    )
    .then(() => undefined);

  await indexesPromise;

  return collection;
}

function getMetricPeriod(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: BUENOS_AIRES_TIMEZONE,
    year: "numeric",
    month: "2-digit",
  }).formatToParts(date);

  const anio = Number(parts.find((part) => part.type === "year")?.value);
  const mes = Number(parts.find((part) => part.type === "month")?.value);

  if (!Number.isInteger(anio) || !Number.isInteger(mes)) {
    throw new Error("No se pudo calcular el periodo de metricas.");
  }

  return { anio, mes };
}

function serializeCredentialMetric(
  metric: WithId<CredentialMetricDocument>,
): CredentialMetric {
  return {
    slug: metric.slug,
    anio: metric.anio,
    mes: metric.mes,
    saveContactClicks: metric.saveContactClicks,
    whatsappClicks: metric.whatsappClicks,
    createdAt: metric.createdAt.toISOString(),
    updatedAt: metric.updatedAt.toISOString(),
  };
}

export async function incrementCredentialMetric(
  slug: string,
  event: CredentialMetricEvent,
) {
  const collection = await getCredentialMetricsCollection();
  const now = new Date();
  const { anio, mes } = getMetricPeriod(now);
  const filter: Filter<CredentialMetricDocument> = { slug, anio, mes };
  const incrementField =
    event === "save_contact" ? "saveContactClicks" : "whatsappClicks";

  await collection.updateOne(filter, {
    $set: {
      updatedAt: now,
    },
    $setOnInsert: {
      slug,
      anio,
      mes,
      saveContactClicks: 0,
      whatsappClicks: 0,
      createdAt: now,
    } satisfies OptionalUnlessRequiredId<CredentialMetricDocument>,
    $inc: {
      [incrementField]: 1,
    },
  });
}

export async function listCredentialMetrics() {
  const collection = await getCredentialMetricsCollection();
  const metrics = await collection
    .find({})
    .sort({ slug: 1, anio: -1, mes: -1 })
    .toArray();

  return metrics.map(serializeCredentialMetric);
}
