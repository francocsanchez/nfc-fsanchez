import "server-only";

import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";

import { sendPasswordResetEmail } from "@/lib/mailer";
import { getDatabase, getMongoClient } from "@/lib/mongodb";
import { getPasswordResetUrl } from "@/lib/public-url";

const baseURL = process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL;

let authPromise: ReturnType<typeof createAuth> | undefined;

async function createAuth() {
  const auth = betterAuth({
    baseURL,
    database: mongodbAdapter(await getDatabase(), {
      client: await getMongoClient(),
      transaction: false,
    }),
    emailAndPassword: {
      enabled: true,
      disableSignUp: true,
      minPasswordLength: 8,
      revokeSessionsOnPasswordReset: true,
      async sendResetPassword({ user, token }, request) {
        const requestOrigin = request ? new URL(request.url).origin : undefined;

        await sendPasswordResetEmail({
          email: user.email,
          name: user.name,
          resetUrl: getPasswordResetUrl(token, baseURL ?? requestOrigin),
        });
      },
    },
    trustedOrigins: baseURL ? [baseURL] : undefined,
    plugins: [nextCookies()],
  });

  if (!auth) {
    throw new Error("Failed to initialize authentication.");
  }

  return auth;
}

export function getAuth() {
  authPromise ??= createAuth();

  return authPromise;
}
