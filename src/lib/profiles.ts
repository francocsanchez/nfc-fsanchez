import "server-only";

import {
  MongoServerError,
  ObjectId,
  type Collection,
  type WithId,
} from "mongodb";
import { z } from "zod";

import { getDatabase } from "@/lib/mongodb";
import {
  createProfileSchema,
  type CreateProfileInput,
  type Profile,
  type UpdateProfileInput,
  updateProfileSchema,
} from "@/lib/profile-schema";

const PROFILES_COLLECTION = "profiles";

export type ProfileDocument = {
  name: string;
  jobTitle: string;
  address: string;
  googleMapsUrl: string;
  email: string;
  whatsapp: string;
  slug: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export class DuplicateSlugError extends Error {
  constructor() {
    super("No se pudo generar un slug unico para este perfil.");
    this.name = "DuplicateSlugError";
  }
}

let indexesPromise: Promise<void> | undefined;

async function getProfilesCollection(): Promise<Collection<ProfileDocument>> {
  const db = await getDatabase();
  const collection = db.collection<ProfileDocument>(PROFILES_COLLECTION);

  indexesPromise ??= collection
    .createIndex({ slug: 1 }, { unique: true, name: "profiles_slug_unique" })
    .then(() => undefined);

  await indexesPromise;

  return collection;
}

function serializeProfile(profile: WithId<ProfileDocument>): Profile {
  return {
    id: profile._id.toHexString(),
    name: profile.name,
    jobTitle: profile.jobTitle ?? "",
    address: profile.address ?? "",
    googleMapsUrl: profile.googleMapsUrl ?? "",
    email: profile.email,
    whatsapp: profile.whatsapp ?? "",
    slug: profile.slug,
    isActive: profile.isActive,
    createdAt: profile.createdAt.toISOString(),
    updatedAt: profile.updatedAt.toISOString(),
  };
}

function slugifyProfileName(name: string) {
  const normalized = name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

  return normalized || "perfil";
}

async function generateUniqueSlug(collection: Collection<ProfileDocument>, name: string) {
  const baseSlug = slugifyProfileName(name);
  let candidate = baseSlug;
  let suffix = 2;

  while (await collection.findOne({ slug: candidate }, { projection: { _id: 1 } })) {
    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}

function parseObjectId(id: string) {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  return new ObjectId(id);
}

function isDuplicateKeyError(error: unknown) {
  return error instanceof MongoServerError && error.code === 11000;
}

export function formatZodError(error: z.ZodError) {
  return error.flatten().fieldErrors;
}

export async function listProfiles() {
  const collection = await getProfilesCollection();
  const profiles = await collection.find({}).sort({ createdAt: -1 }).toArray();

  return profiles.map(serializeProfile);
}

export async function getProfileById(id: string) {
  const objectId = parseObjectId(id);

  if (!objectId) {
    return null;
  }

  const collection = await getProfilesCollection();
  const profile = await collection.findOne({ _id: objectId });

  return profile ? serializeProfile(profile) : null;
}

export async function getPublicProfileBySlug(slug: string) {
  const collection = await getProfilesCollection();
  const profile = await collection.findOne({ slug, isActive: true });

  return profile ? serializeProfile(profile) : null;
}

export async function createProfile(input: CreateProfileInput) {
  const data = createProfileSchema.parse(input);
  const collection = await getProfilesCollection();
  const slug = await generateUniqueSlug(collection, data.name);
  const now = new Date();

  const document: ProfileDocument = {
    ...data,
    slug,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };

  try {
    const result = await collection.insertOne(document);
    const created = await collection.findOne({ _id: result.insertedId });

    if (!created) {
      throw new Error("Profile was created but could not be loaded.");
    }

    return serializeProfile(created);
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      throw new DuplicateSlugError();
    }

    throw error;
  }
}

export async function updateProfile(id: string, input: UpdateProfileInput) {
  const objectId = parseObjectId(id);

  if (!objectId) {
    return null;
  }

  const data = updateProfileSchema.parse(input);
  const collection = await getProfilesCollection();
  const now = new Date();

  await collection.updateOne(
    { _id: objectId },
    {
      $set: {
        name: data.name,
        jobTitle: data.jobTitle,
        address: data.address,
        googleMapsUrl: data.googleMapsUrl,
        email: data.email,
        whatsapp: data.whatsapp,
        isActive: data.isActive,
        updatedAt: now,
      },
      $unset: {
        landingUrl: "",
      },
    },
  );

  const updated = await collection.findOne({ _id: objectId });

  return updated ? serializeProfile(updated) : null;
}
