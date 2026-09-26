import "server-only";

import { MongoClient, type Db } from "mongodb";

declare global {
  var __mongoClientPromise__: Promise<MongoClient> | undefined;
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

function getMongoConfig() {
  const directUri = process.env.DATABASE_MONGO;

  if (directUri) {
    return {
      uri: directUri,
      dbName: getDatabaseNameFromUri(directUri),
    };
  }

  const mongoUri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME;

  if (mongoUri && dbName) {
    return {
      uri: mongoUri,
      dbName,
    };
  }

  throw new Error(
    "Missing MongoDB configuration. Set DATABASE_MONGO or MONGODB_URI with MONGODB_DB_NAME.",
  );
}

export function getMongoClient(): Promise<MongoClient> {
  const { uri } = getMongoConfig();

  const clientPromise =
    global.__mongoClientPromise__ ??
    new MongoClient(uri, {
      // A public credential can receive many concurrent scans. Reusing this
      // process-wide pool prevents opening an unbounded client per request.
      maxPoolSize: 20,
      serverSelectionTimeoutMS: 5_000,
    }).connect();

  // Keep the connection pool for the lifetime of the process in every
  // environment. Limiting this to development leaks clients in production.
  global.__mongoClientPromise__ = clientPromise;

  return clientPromise;
}

export async function getDatabase(): Promise<Db> {
  const { dbName } = getMongoConfig();
  const client = await getMongoClient();

  return client.db(dbName);
}
