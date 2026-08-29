function normalizeBaseUrl(baseUrl: string) {
  return baseUrl.replace(/\/+$/, "");
}

export function getAppBaseUrl(
  baseUrl = process.env.NEXT_PUBLIC_APP_URL,
) {
  if (!baseUrl) {
    return "";
  }

  try {
    return new URL(baseUrl).origin;
  } catch {
    return normalizeBaseUrl(baseUrl);
  }
}

export function getPublicProfileUrl(slug: string, baseUrl = process.env.NEXT_PUBLIC_APP_URL) {
  const path = `/credenciales/${slug}`;

  const normalizedBaseUrl = getAppBaseUrl(baseUrl);

  if (!normalizedBaseUrl) {
    return path;
  }

  return `${normalizedBaseUrl}${path}`;
}
