import "server-only";

import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";

import { getDatabase, getMongoClient } from "@/lib/mongodb";

const baseURL = process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL;

export const auth = betterAuth({
  baseURL,
  database: mongodbAdapter(await getDatabase(), {
    client: await getMongoClient(),
    transaction: false,
  }),
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
    minPasswordLength: 8,
  },
  trustedOrigins: baseURL ? [baseURL] : undefined,
  plugins: [nextCookies()],
});
