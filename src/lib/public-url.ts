function normalizeBaseUrl(baseUrl: string) {
  return baseUrl.replace(/\/+$/, "");
}

export function getPublicProfileUrl(slug: string, baseUrl = process.env.NEXT_PUBLIC_APP_URL) {
  const path = `/${slug}`;

  if (!baseUrl) {
    return path;
  }

  return `${normalizeBaseUrl(baseUrl)}${path}`;
}
