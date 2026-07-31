import Image from "next/image";
import { Download, FileText, Globe, MapPin, MessageCircle } from "lucide-react";
import { notFound } from "next/navigation";

import { getCatalogSettings } from "@/lib/catalog";
import { getPublicProfileBySlug } from "@/lib/profiles";

export const dynamic = "force-dynamic";

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

function getProfilePhotoSrc(profilePhotoUrl: string, updatedAt: string) {
  if (!profilePhotoUrl) {
    return "";
  }

  const separator = profilePhotoUrl.includes("?") ? "&" : "?";

  return `${profilePhotoUrl}${separator}v=${encodeURIComponent(updatedAt)}`;
}

function ProfileAvatar({
  name,
  profilePhotoUrl,
  updatedAt,
}: {
  name: string;
  profilePhotoUrl: string;
  updatedAt: string;
}) {
  if (profilePhotoUrl) {
    return (
      <div className="h-20 w-20 overflow-hidden border border-foreground bg-background md:h-28 md:w-28 xl:h-32 xl:w-32">
        <Image
          src={getProfilePhotoSrc(profilePhotoUrl, updatedAt)}
          alt={`Foto de perfil de ${name}`}
          width={160}
          height={160}
          unoptimized
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="flex h-20 w-20 items-center justify-center border border-foreground bg-background text-2xl font-semibold tracking-[-0.08em] md:h-28 md:w-28 md:text-3xl xl:h-32 xl:w-32">
      {getInitials(name)}
    </div>
  );
}

function DetailRow({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
      <span className="mt-0.5 shrink-0 text-foreground">{icon}</span>
      <div className="min-w-0">{children}</div>
    </div>
  );
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

  const whatsappUrl = getWhatsappUrl(profile.whatsapp);
  const contactCardUrl = `/api/credenciales/${profile.slug}/contact-click`;
  const whatsappTrackingUrl = `/api/credenciales/${profile.slug}/whatsapp-click`;
  const catalog =
    profile.rol === "vendedor" ? await getCatalogSettings() : { items: [] };
  const showCatalog = profile.rol === "vendedor" && catalog.items.length > 0;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-5 pb-8 pt-5 sm:px-6 md:max-w-[88rem] md:px-8 md:py-8 lg:px-10 xl:px-12">
        <section className="relative overflow-hidden border border-border bg-card">
          <div className="md:grid md:grid-cols-[minmax(20rem,25rem)_minmax(0,1fr)] md:items-start xl:grid-cols-[minmax(22rem,27rem)_minmax(0,1fr)]">
            <div className="space-y-5 px-5 py-6 md:sticky md:top-8 md:min-h-[calc(100vh-4rem)] md:border-r md:border-border md:px-7 md:py-8 lg:px-9 xl:px-10">
              <ProfileAvatar
                name={profile.name}
                profilePhotoUrl={profile.profilePhotoUrl}
                updatedAt={profile.updatedAt}
              />

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

                <div className="space-y-3 md:space-y-4">
                  {profile.websiteUrl ? (
                    <DetailRow icon={<Globe className="h-4 w-4" />}>
                      <a
                        href={profile.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="underline decoration-border underline-offset-4 transition hover:text-foreground"
                      >
                        {profile.websiteUrl}
                      </a>
                    </DetailRow>
                  ) : null}
                  {profile.googleMapsUrl ? (
                    <DetailRow icon={<MapPin className="h-4 w-4" />}>
                      <a
                        href={profile.googleMapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="underline decoration-border underline-offset-4 transition hover:text-foreground"
                      >
                        {profile.address}
                      </a>
                    </DetailRow>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="border-t border-border md:border-t-0">
              <div className="space-y-8 px-5 py-6 md:px-7 md:py-8 lg:px-9 lg:py-10 xl:px-12">
                <div className="space-y-4 md:space-y-5">
                  <div className="space-y-2">
                    <p className="text-[0.72rem] uppercase tracking-[0.28em] text-muted-foreground">
                      Accesos
                    </p>
                    <p className="max-w-[34rem] text-sm leading-6 text-muted-foreground">
                      Guarda esta credencial en tu telefono o inicia una
                      conversacion directa.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 md:max-w-xl">
                    <a
                      href={contactCardUrl}
                      className="inline-flex min-h-14 items-center justify-center gap-3 border border-border bg-muted px-4 text-sm font-medium text-foreground transition hover:border-foreground hover:bg-background"
                    >
                      <Download className="h-4 w-4" />
                      Guardar contacto
                    </a>

                    {whatsappUrl ? (
                      <a
                        href={whatsappTrackingUrl}
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

                {showCatalog ? (
                  <div className="border-t border-border pt-5 md:pt-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <p className="text-[0.72rem] uppercase tracking-[0.28em] text-muted-foreground">
                          Catalogo
                        </p>
                        <p className="max-w-[36rem] text-sm leading-6 text-muted-foreground">
                          Productos y fichas tecnicas disponibles para consultar
                          desde esta credencial.
                        </p>
                      </div>

                      <div className="grid gap-3 md:grid-cols-2 md:gap-4 xl:gap-5">
                        {catalog.items.map((item, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-[5.5rem_minmax(0,1fr)_2.75rem] items-center gap-3 px-1 py-2 md:grid-cols-1 md:items-start md:gap-4 md:border md:border-border md:bg-background md:px-4 md:py-4 lg:px-5 lg:py-5"
                          >
                            <div className="overflow-hidden border border-border bg-muted">
                              <Image
                                src={item.imageUrl}
                                alt={item.name}
                                width={580}
                                height={280}
                                unoptimized
                                className="aspect-[29/14] h-auto w-full object-cover"
                              />
                            </div>

                            <div className="min-w-0 md:space-y-3">
                              <p className="line-clamp-2 break-words text-sm font-medium text-foreground sm:text-base">
                                {item.name}
                              </p>
                            </div>

                            <a
                              href={item.technicalSheetUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex h-11 w-11 items-center justify-center border border-border bg-muted text-foreground transition hover:border-foreground hover:bg-background md:h-12 md:w-full md:gap-2 md:px-4"
                              aria-label={`Abrir ficha tecnica de ${item.name}`}
                            >
                              <FileText className="h-4 w-4" />
                              <span className="sr-only md:not-sr-only">Ficha tecnica</span>
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}

                <footer className="border-t border-border pt-5">
                  <p className="text-center text-[0.72rem] uppercase tracking-[0.28em] text-muted-foreground">
                    BY <span className="font-semibold text-foreground">ContactoActivo</span>
                  </p>
                </footer>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
