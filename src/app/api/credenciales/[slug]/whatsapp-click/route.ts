import { NextResponse } from "next/server";

import { incrementCredentialMetric } from "@/lib/credential-metrics";
import { getPublicProfileBySlug } from "@/lib/profiles";

function getWhatsappUrl(whatsapp: string) {
  const digits = whatsapp.replace(/\D/g, "").replace(/^0+/, "");

  return digits ? `https://wa.me/549${digits}` : null;
}

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const profile = await getPublicProfileBySlug(slug);

  if (!profile) {
    return NextResponse.json({ error: "Perfil no encontrado." }, { status: 404 });
  }

  const whatsappUrl = getWhatsappUrl(profile.whatsapp);

  if (!whatsappUrl) {
    return NextResponse.json(
      { error: "El perfil no tiene WhatsApp disponible." },
      { status: 404 },
    );
  }

  await incrementCredentialMetric(profile.slug, "whatsapp");

  return NextResponse.redirect(new URL(whatsappUrl, request.url));
}
