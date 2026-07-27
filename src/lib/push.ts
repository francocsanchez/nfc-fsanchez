import "server-only";

import webpush from "web-push";

export type PushSubscriptionPayload = {
  endpoint: string;
  expirationTime?: number | null;
  keys: {
    p256dh: string;
    auth: string;
  };
};

let vapidConfigured = false;

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getPushPublicKey() {
  return process.env.WEB_PUSH_VAPID_PUBLIC_KEY ?? "";
}

export function isPushConfigured() {
  return Boolean(
    process.env.WEB_PUSH_VAPID_PUBLIC_KEY &&
      process.env.WEB_PUSH_VAPID_PRIVATE_KEY &&
      process.env.WEB_PUSH_SUBJECT,
  );
}

function configureVapidDetails() {
  if (vapidConfigured) {
    return;
  }

  webpush.setVapidDetails(
    getRequiredEnv("WEB_PUSH_SUBJECT"),
    getRequiredEnv("WEB_PUSH_VAPID_PUBLIC_KEY"),
    getRequiredEnv("WEB_PUSH_VAPID_PRIVATE_KEY"),
  );
  vapidConfigured = true;
}

export async function sendWebPushNotification(
  subscription: PushSubscriptionPayload,
  payload: Record<string, unknown>,
) {
  if (!isPushConfigured()) {
    throw new Error(
      "Web push is not configured. Set WEB_PUSH_VAPID_PUBLIC_KEY, WEB_PUSH_VAPID_PRIVATE_KEY and WEB_PUSH_SUBJECT.",
    );
  }

  configureVapidDetails();

  return webpush.sendNotification(subscription, JSON.stringify(payload));
}
