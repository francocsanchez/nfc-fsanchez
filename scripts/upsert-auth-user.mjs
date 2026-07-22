import crypto from "node:crypto";

import { hashPassword } from "better-auth/crypto";
import { MongoClient } from "mongodb";

function getMongoConfig() {
  if (process.env.DATABASE_MONGO) {
    const url = new URL(process.env.DATABASE_MONGO);
    const dbName = url.pathname.replace(/^\/+/, "");

    if (!dbName) {
      throw new Error("DATABASE_MONGO must include a database name in the path.");
    }

    return {
      uri: process.env.DATABASE_MONGO,
      dbName,
    };
  }

  if (process.env.MONGODB_URI && process.env.MONGODB_DB_NAME) {
    return {
      uri: process.env.MONGODB_URI,
      dbName: process.env.MONGODB_DB_NAME,
    };
  }

  throw new Error(
    "Missing MongoDB configuration. Set DATABASE_MONGO or MONGODB_URI with MONGODB_DB_NAME.",
  );
}

function getRequiredEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

async function main() {
  const email = getRequiredEnv("ADMIN_SEED_EMAIL").trim().toLowerCase();
  const password = getRequiredEnv("ADMIN_SEED_PASSWORD");
  const name = (process.env.ADMIN_SEED_NAME ?? email).trim();
  const { uri, dbName } = getMongoConfig();

  const client = new MongoClient(uri);
  await client.connect();

  try {
    const db = client.db(dbName);
    const users = db.collection("user");
    const accounts = db.collection("account");
    const now = new Date();
    const passwordHash = await hashPassword(password);

    const existingUser = await users.findOne({ email });
    const userId = existingUser?.id ?? crypto.randomUUID();

    await users.updateOne(
      { email },
      {
        $set: {
          email,
          name,
          image: null,
          emailVerified: true,
          updatedAt: now,
        },
        $setOnInsert: {
          id: userId,
          createdAt: now,
        },
      },
      { upsert: true },
    );

    await accounts.updateOne(
      {
        userId,
        providerId: "credential",
      },
      {
        $set: {
          accountId: userId,
          providerId: "credential",
          password: passwordHash,
          updatedAt: now,
        },
        $setOnInsert: {
          id: crypto.randomUUID(),
          userId,
          createdAt: now,
        },
      },
      { upsert: true },
    );

    console.log(`Auth user ready: ${email}`);
  } finally {
    await client.close();
  }
}

await main();
