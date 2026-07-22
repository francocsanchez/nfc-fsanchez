import "server-only";

import { MongoClient, type Db } from "mongodb";

declare global {
  var __mongoClientPromise__: Promise<MongoClient> | undefined;
}

function getRequiredEnv(name: "MONGODB_URI" | "MONGODB_DB_NAME") {
  const value =
    name === "MONGODB_URI"
      ? process.env.MONGODB_URI ?? process.env.DATABASE_MONGO
      : process.env.MONGODB_DB_NAME;

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export async function getDatabase(): Promise<Db> {
  const uri = getRequiredEnv("MONGODB_URI");
  const dbName = getRequiredEnv("MONGODB_DB_NAME");

  const clientPromise =
    global.__mongoClientPromise__ ?? new MongoClient(uri).connect();

  if (process.env.NODE_ENV !== "production") {
    global.__mongoClientPromise__ = clientPromise;
  }

  const client = await clientPromise;

  return client.db(dbName);
}
