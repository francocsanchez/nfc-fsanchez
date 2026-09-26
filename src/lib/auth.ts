import "server-only";

export type CentralSession = {
  user: {
    id: string;
    name: string | null;
    email: string;
    isActive: boolean;
    isCentralAdmin: boolean;
  };
  session: {
    id: string;
    expiresAt: string;
  };
  access: Array<{
    appKey: string;
    role: "admin" | "user" | "viewer";
  }>;
};

export type CentralSessionResult =
  | {
      status: "authenticated";
      session: CentralSession;
    }
  | {
      status: "unauthenticated";
    }
  | {
      status: "forbidden";
    }
  | {
      status: "unavailable";
    };

type CentralAuthConfig = {
  appKey: string;
  centralAuthUrl: string;
  centralAuthPublicUrl: string;
  appBaseUrl: string;
};

function getRequiredEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function normalizeBaseUrl(baseUrl: string) {
  return baseUrl.replace(/\/+$/, "");
}

function getCentralAuthConfig(): CentralAuthConfig {
  return {
    appKey: getRequiredEnv("CENTRAL_APP_KEY"),
    centralAuthUrl: normalizeBaseUrl(getRequiredEnv("CENTRAL_AUTH_URL")),
    centralAuthPublicUrl: normalizeBaseUrl(
      process.env.CENTRAL_AUTH_PUBLIC_URL?.trim() || getRequiredEnv("CENTRAL_AUTH_URL"),
    ),
    appBaseUrl: normalizeBaseUrl(getRequiredEnv("NEXT_PUBLIC_APP_URL")),
  };
}

function resolveRequestOrigin(requestHeaders?: Headers) {
  const forwardedHost = requestHeaders?.get("x-forwarded-host");
  const host = forwardedHost ?? requestHeaders?.get("host");

  if (!host) {
    return null;
  }

  const forwardedProto = requestHeaders?.get("x-forwarded-proto");
  const protocol = forwardedProto ?? (host.includes("localhost") ? "http" : "https");

  return `${protocol}://${host}`;
}

function toReturnToUrl(returnTo: string, requestHeaders?: Headers) {
  if (/^https?:\/\//i.test(returnTo)) {
    return returnTo;
  }

  const baseUrl =
    resolveRequestOrigin(requestHeaders) ?? getCentralAuthConfig().appBaseUrl;

  return new URL(returnTo.startsWith("/") ? returnTo : `/${returnTo}`, baseUrl).toString();
}

export function hasAppAccess(
  session: CentralSession,
  appKey = getCentralAuthConfig().appKey,
) {
  return session.access.some((access) => access.appKey === appKey);
}

export function getAppRole(
  session: CentralSession,
  appKey = getCentralAuthConfig().appKey,
) {
  return session.access.find((access) => access.appKey === appKey)?.role ?? null;
}

export function getCentralLoginUrl(
  returnTo: string,
  requestHeaders?: Headers,
) {
  const { appKey, centralAuthPublicUrl } = getCentralAuthConfig();
  const loginUrl = new URL("/login", centralAuthPublicUrl);

  loginUrl.searchParams.set("appKey", appKey);
  loginUrl.searchParams.set("returnTo", toReturnToUrl(returnTo, requestHeaders));

  return loginUrl.toString();
}

export function getCentralLogoutUrl(
  returnTo = "/",
  requestHeaders?: Headers,
) {
  const { centralAuthPublicUrl } = getCentralAuthConfig();
  const logoutUrl = new URL("/logout", centralAuthPublicUrl);

  logoutUrl.searchParams.set("returnTo", toReturnToUrl(returnTo, requestHeaders));

  return logoutUrl.toString();
}

export async function getCentralSession(
  requestHeaders: Headers,
): Promise<CentralSessionResult> {
  const { appKey, centralAuthUrl } = getCentralAuthConfig();
  const sessionUrl = new URL("/api/internal/session", centralAuthUrl);
  const cookie = requestHeaders.get("cookie");

  sessionUrl.searchParams.set("appKey", appKey);

  let response: Response;

  try {
    response = await fetch(sessionUrl, {
      method: "GET",
      headers: cookie ? { cookie } : undefined,
      cache: "no-store",
      signal: AbortSignal.timeout(5_000),
    });
  } catch (error) {
    console.error("Central auth session request is unavailable", error);

    return { status: "unavailable" };
  }

  if (response.status === 401) {
    return { status: "unauthenticated" };
  }

  if (response.status === 403) {
    return { status: "forbidden" };
  }

  if (!response.ok) {
    throw new Error(
      `Central auth session request failed with status ${response.status}.`,
    );
  }

  const session = (await response.json()) as CentralSession;

  if (!hasAppAccess(session, appKey)) {
    return { status: "forbidden" };
  }

  return {
    status: "authenticated",
    session,
  };
}
