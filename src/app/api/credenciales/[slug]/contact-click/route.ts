import { NextResponse } from "next/server";

import { incrementCredentialMetric } from "@/lib/credential-metrics";
import { getPublicProfileBySlug } from "@/lib/profiles";

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const profile = await getPublicProfileBySlug(slug);

  if (!profile) {
    return NextResponse.json({ error: "Perfil no encontrado." }, { status: 404 });
  }

  await incrementCredentialMetric(profile.slug, "save_contact");

  return NextResponse.redirect(new URL(`/api/contacts/${profile.slug}`, request.url));
}
