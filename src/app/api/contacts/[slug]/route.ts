import { type NextRequest, NextResponse } from "next/server";

import { getProfileGlobalSettings } from "@/lib/profile-global-settings";
import { getPublicProfileBySlug } from "@/lib/profiles";

function escapeVCardValue(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function buildVCard(
  profile: Awaited<ReturnType<typeof getPublicProfileBySlug>>,
  globalSettings: Awaited<ReturnType<typeof getProfileGlobalSettings>>,
) {
  if (!profile) {
    return null;
  }

  const fullName = escapeVCardValue(profile.name);
  const orgTitle = escapeVCardValue(profile.jobTitle);
  const email = escapeVCardValue(profile.email);
  const address = escapeVCardValue(profile.address);
  const whatsapp = profile.whatsapp ? `+54 9 ${profile.whatsapp}` : "";
  const websiteUrl = escapeVCardValue(globalSettings.websiteUrl);
  const instagramUrl = escapeVCardValue(globalSettings.instagramUrl);

  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${fullName}`,
    `N:${fullName};;;;`,
    profile.jobTitle ? `TITLE:${orgTitle}` : "",
    profile.email ? `EMAIL;TYPE=INTERNET:${email}` : "",
    profile.whatsapp ? `TEL;TYPE=CELL:${escapeVCardValue(whatsapp)}` : "",
    profile.address ? `ADR;TYPE=WORK:;;${address};;;;` : "",
    globalSettings.websiteUrl ? `URL:${websiteUrl}` : "",
    globalSettings.instagramUrl
      ? `X-SOCIALPROFILE;TYPE=instagram:${instagramUrl}`
      : "",
    "END:VCARD",
  ]
    .filter(Boolean)
    .join("\r\n");
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const [profile, globalSettings] = await Promise.all([
    getPublicProfileBySlug(slug),
    getProfileGlobalSettings(),
  ]);

  if (!profile) {
    return NextResponse.json({ error: "Perfil no encontrado." }, { status: 404 });
  }

  const vCard = buildVCard(profile, globalSettings);

  return new NextResponse(vCard, {
    status: 200,
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="${profile.slug}.vcf"`,
      "Cache-Control": "no-store",
    },
  });
}
