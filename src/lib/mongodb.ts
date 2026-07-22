import "server-only";

import { MongoClient, type Db } from "mongodb";

declare global {
  var __mongoClientPromise__: Promise<MongoClient> | undefined;
}

function getRequiredEnv(name: "DATABASE_MONGO") {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function getDatabaseNameFromUri(uri: string) {
  const parsed = new URL(uri);
  const dbName = parsed.pathname.replace(/^\/+/, "");

  if (!dbName) {
    throw new Error(
      "DATABASE_MONGO must include a database name in the connection string path.",
    );
  }

  return dbName;
}

export async function getDatabase(): Promise<Db> {
  const uri = getRequiredEnv("DATABASE_MONGO");
  const dbName = getDatabaseNameFromUri(uri);

  const clientPromise =
    global.__mongoClientPromise__ ?? new MongoClient(uri).connect();

  if (process.env.NODE_ENV !== "production") {
    global.__mongoClientPromise__ = clientPromise;
  }

  const client = await clientPromise;

  return client.db(dbName);
}
