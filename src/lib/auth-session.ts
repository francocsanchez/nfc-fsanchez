import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  type CentralSessionResult,
  getCentralLoginUrl,
  getCentralLogoutUrl,
  getCentralSession,
} from "@/lib/auth";

export async function getSessionResultFromHeaders(requestHeaders: Headers) {
  return getCentralSession(requestHeaders);
}

export async function getSessionFromHeaders(requestHeaders: Headers) {
  const result = await getSessionResultFromHeaders(requestHeaders);

  return result.status === "authenticated" ? result.session : null;
}

export async function getCurrentSessionResult() {
  return getSessionResultFromHeaders(await headers());
}

export async function getCurrentSession() {
  const result = await getCurrentSessionResult();

  return result.status === "authenticated" ? result.session : null;
}

export function createSessionErrorResponse(
  result: Exclude<CentralSessionResult, { status: "authenticated" }>,
) {
  if (result.status === "forbidden") {
    return Response.json({ error: "Acceso denegado." }, { status: 403 });
  }

  return Response.json({ error: "No autorizado." }, { status: 401 });
}

export async function requireSession(nextPath = "/credenciales/perfiles/admin") {
  const requestHeaders = await headers();
  const result = await getSessionResultFromHeaders(requestHeaders);

  if (result.status === "unauthenticated") {
    redirect(getCentralLoginUrl(nextPath, requestHeaders));
  }

  if (result.status === "forbidden") {
    redirect("/forbidden");
  }

  return result.session;
}

export async function requireAdminSession() {
  return requireSession("/credenciales/perfiles/admin");
}

export async function logoutToCentral(returnTo = "/") {
  const requestHeaders = await headers();

  redirect(getCentralLogoutUrl(returnTo, requestHeaders));
}
