import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getAuth } from "@/lib/auth";

export async function getSessionFromHeaders(requestHeaders: Headers) {
  const auth = await getAuth();

  return auth.api.getSession({
    headers: requestHeaders,
  });
}

export async function getCurrentSession() {
  return getSessionFromHeaders(await headers());
}

export async function requireSession(nextPath = "/admin/perfiles") {
  const session = await getCurrentSession();

  if (!session) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }

  return session;
}

export async function requireAdminSession() {
  return requireSession("/admin/perfiles");
}
