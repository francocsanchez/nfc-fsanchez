import { Download, MapPin, MessageCircle } from "lucide-react";
import { notFound } from "next/navigation";

import { getPublicProfileBySlug } from "@/lib/profiles";

function getWhatsappUrl(whatsapp: string) {
  const digits = whatsapp.replace(/\D/g, "").replace(/^0+/, "");

  return digits ? `https://wa.me/549${digits}` : null;
}

function getInitials(name: string) {
  const parts = name
    .split(" ")
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 2);

  if (parts.length === 0) {
    return "NF";
  }

  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const profile = await getPublicProfileBySlug(slug);

  if (!profile) {
    notFound();
  }

  const initials = getInitials(profile.name);
  const whatsappUrl = getWhatsappUrl(profile.whatsapp);
  const contactCardUrl = `/api/contacts/${profile.slug}`;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-5 pb-8 pt-5 sm:px-6">
        <section className="relative overflow-hidden border border-border bg-card">
          <div className="space-y-8 px-5 py-6">
            <div className="space-y-5">
              <div className="flex h-20 w-20 items-center justify-center border border-foreground bg-background text-2xl font-semibold tracking-[-0.08em]">
                {initials}
              </div>

              <div className="space-y-3">
                <div className="space-y-2">
                  <h1 className="max-w-[12ch] text-4xl font-semibold tracking-[-0.08em] text-foreground">
                    {profile.name}
                  </h1>
                  <p className="max-w-[26ch] text-base leading-6 text-muted-foreground">
                    {profile.jobTitle}
                  </p>
                </div>

                <div className="h-px w-16 bg-foreground" />

                <div className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
                  {profile.googleMapsUrl ? (
                    <a
                      href={profile.googleMapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="underline decoration-border underline-offset-4 transition hover:text-foreground"
                    >
                      {profile.address}
                    </a>
                  ) : (
                    <p>{profile.address}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-5">
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={contactCardUrl}
                  className="inline-flex min-h-14 items-center justify-center gap-3 border border-border bg-muted px-4 text-sm font-medium text-foreground transition hover:border-foreground hover:bg-background"
                >
                  <Download className="h-4 w-4" />
                  Guardar contacto
                </a>

                {whatsappUrl ? (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-14 items-center justify-center gap-3 border border-foreground bg-foreground px-4 text-sm font-medium text-background transition hover:bg-background hover:text-foreground"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </a>
                ) : (
                  <div className="inline-flex min-h-14 items-center justify-center border border-border bg-muted px-4 text-sm text-muted-foreground">
                    Sin WhatsApp
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
