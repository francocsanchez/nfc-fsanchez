import Image from "next/image";
import {
  ChatBubble,
  Download,
  Globe,
  Instagram,
  MapPin,
  Page,
} from "iconoir-react";
import { Hanken_Grotesk } from "next/font/google";
import { notFound } from "next/navigation";

import { getCatalogSettings } from "@/lib/catalog";
import { getProfileGlobalSettings } from "@/lib/profile-global-settings";
import { getPublicProfileBySlug } from "@/lib/profiles";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-admin-landing",
});

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
  className,
}: {
  name: string;
  profilePhotoUrl: string;
  updatedAt: string;
  className?: string;
}) {
  if (profilePhotoUrl) {
    return (
      <div className={cn("overflow-hidden bg-background", className)}>
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
    <div
      className={cn(
        "flex items-center justify-center bg-black text-2xl font-semibold tracking-[-0.08em] text-white",
        className,
      )}
    >
      {getInitials(name)}
    </div>
  );
}

function DetailRow({
  icon,
  children,
  link = false,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  link?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 text-sm leading-6 text-[#4c4546]">
      <span className="mt-0.5 shrink-0 text-[#7e7576]">{icon}</span>
      <div
        className={cn(
          "min-w-0 break-all",
          link ? "underline underline-offset-4 decoration-[#cfc4c5]" : "",
        )}
      >
        {children}
      </div>
    </div>
  );
}

type PublicProfile = NonNullable<
  Awaited<ReturnType<typeof getPublicProfileBySlug>>
>;

type GlobalSettings = Awaited<ReturnType<typeof getProfileGlobalSettings>>;

function getProfileBranch(profile: PublicProfile, globalSettings: GlobalSettings) {
  if (!profile.branchId) {
    return null;
  }

  return globalSettings.branches.find((branch) => branch.id === profile.branchId) ?? null;
}

function ContactActions({
  contactCardUrl,
  whatsappTrackingUrl,
  hasWhatsapp,
  monochrome = false,
}: {
  contactCardUrl: string;
  whatsappTrackingUrl: string;
  hasWhatsapp: boolean;
  monochrome?: boolean;
}) {
  return (
    <div className="space-y-4 md:space-y-5">
      

      <div
        className={cn(
          "grid gap-3",
          monochrome ? "grid-cols-1 sm:grid-cols-2 md:max-w-xl" : "grid-cols-2 md:max-w-xl",
        )}
      >
        <a
          href={contactCardUrl}
          className={cn(
            "inline-flex min-h-14 items-center justify-center gap-3 px-4 text-sm font-medium transition",
            monochrome
              ? "border border-[#cfc4c5] bg-[#f3f3f4] text-black hover:bg-[#eeeeee]"
              : "border border-border bg-muted text-foreground hover:border-foreground hover:bg-background",
          )}
        >
          <Download className="h-4 w-4" />
          Guardar contacto
        </a>

        {hasWhatsapp ? (
          <a
            href={whatsappTrackingUrl}
            target="_blank"
            rel="noreferrer"
            className={cn(
              "inline-flex min-h-14 items-center justify-center gap-3 px-4 text-sm font-medium transition",
              monochrome
                ? "bg-black text-white hover:opacity-90"
                : "border border-foreground bg-foreground text-background hover:bg-background hover:text-foreground",
            )}
          >
            <ChatBubble className="h-4 w-4" />
            WhatsApp
          </a>
        ) : (
          <div
            className={cn(
              "inline-flex min-h-14 items-center justify-center px-4 text-sm",
              monochrome
                ? "border border-[#cfc4c5] bg-[#f3f3f4] text-[#7e7576]"
                : "border border-border bg-muted text-muted-foreground",
            )}
          >
            Sin WhatsApp
          </div>
        )}
      </div>
    </div>
  );
}

function CatalogSection({
  items,
}: {
  items: Awaited<ReturnType<typeof getCatalogSettings>>["items"];
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="border-t border-border pt-5 md:pt-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-[0.72rem] uppercase tracking-[0.28em] text-muted-foreground">
            Catalogo
          </p>
          <p className="max-w-[36rem] text-sm leading-6 text-muted-foreground">
            Productos y fichas tecnicas disponibles.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2 md:gap-4 xl:gap-5">
          {items.map((item, index) => (
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
                <Page className="h-4 w-4" />
                <span className="sr-only md:not-sr-only">Ficha tecnica</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StandardProfileLayout({
  profile,
  globalSettings,
  contactCardUrl,
  whatsappTrackingUrl,
  hasWhatsapp,
  isSeller,
  catalogItems,
}: {
  profile: PublicProfile;
  globalSettings: GlobalSettings;
  contactCardUrl: string;
  whatsappTrackingUrl: string;
  hasWhatsapp: boolean;
  isSeller: boolean;
  catalogItems: Awaited<ReturnType<typeof getCatalogSettings>>["items"];
}) {
  const branch = getProfileBranch(profile, globalSettings);

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
                className="h-20 w-20 border border-foreground md:h-28 md:w-28 xl:h-32 xl:w-32"
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
                  {globalSettings.websiteUrl ? (
                    <DetailRow icon={<Globe className="h-4 w-4" />} link>
                      <a href={globalSettings.websiteUrl} target="_blank" rel="noreferrer">
                        {globalSettings.websiteUrl}
                      </a>
                    </DetailRow>
                  ) : null}

                  {globalSettings.instagramUrl ? (
                    <DetailRow icon={<Instagram className="h-4 w-4" />} link>
                      <a
                        href={globalSettings.instagramUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {globalSettings.instagramUrl}
                      </a>
                    </DetailRow>
                  ) : null}

                  {branch?.address ? (
                    <DetailRow icon={<MapPin className="h-4 w-4" />} link={Boolean(branch.googleMapsUrl)}>
                      {branch.googleMapsUrl ? (
                        <a href={branch.googleMapsUrl} target="_blank" rel="noreferrer">
                          {branch.address}
                        </a>
                      ) : (
                        <span>{branch.address}</span>
                      )}
                    </DetailRow>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="border-t border-border md:border-t-0">
              <div className="space-y-8 px-5 py-6 md:px-7 md:py-8 lg:px-9 lg:py-10 xl:px-12">
                <ContactActions
                  contactCardUrl={contactCardUrl}
                  whatsappTrackingUrl={whatsappTrackingUrl}
                  hasWhatsapp={hasWhatsapp}
                />

                {isSeller ? <CatalogSection items={catalogItems} /> : null}

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

function AdministrationProfileLayout({
  profile,
  globalSettings,
  contactCardUrl,
  whatsappTrackingUrl,
  hasWhatsapp,
}: {
  profile: PublicProfile;
  globalSettings: GlobalSettings;
  contactCardUrl: string;
  whatsappTrackingUrl: string;
  hasWhatsapp: boolean;
}) {
  const branch = getProfileBranch(profile, globalSettings);

  return (
    <main
      className={cn(
        "min-h-screen bg-[#f9f9f9] text-[#1a1c1c]",
        hankenGrotesk.variable,
        "font-[var(--font-admin-landing)]",
      )}
    >
      <div className="flex min-h-screen items-center justify-center p-0 md:p-6">
        <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col overflow-hidden bg-white md:min-h-[600px] md:flex-row md:border md:border-[#e2e2e2]">
          <div className="flex w-full flex-col items-center border-[#e2e2e2] px-6 py-6 text-center md:w-1/3 md:border-r md:px-12 md:py-12">
            <ProfileAvatar
              name={profile.name}
              profilePhotoUrl={profile.profilePhotoUrl}
              updatedAt={profile.updatedAt}
              className="mb-6 aspect-square w-full max-w-[240px] bg-black"
            />

            <div className="mb-12">
              <h1 className="text-[28px] leading-[36px] font-bold tracking-[-0.02em] text-black md:text-[32px] md:leading-[40px]">
                {profile.name}
              </h1>
              <p className="mt-1 text-[18px] leading-7 text-[#4c4546]">
                {profile.jobTitle}
              </p>
              <hr className="mt-6 border-t border-[#cfc4c5] md:hidden" />
            </div>

            <div className="mt-auto hidden border-t border-[#e2e2e2] pt-12 md:flex md:flex-col md:gap-3">
              {globalSettings.websiteUrl ? (
                <DetailRow icon={<Globe className="h-5 w-5" />} link>
                  <a href={globalSettings.websiteUrl} target="_blank" rel="noreferrer">
                    {globalSettings.websiteUrl}
                  </a>
                </DetailRow>
              ) : null}
              {globalSettings.instagramUrl ? (
                <DetailRow icon={<Instagram className="h-5 w-5" />} link>
                  <a href={globalSettings.instagramUrl} target="_blank" rel="noreferrer">
                    {globalSettings.instagramUrl}
                  </a>
                </DetailRow>
              ) : null}
              {branch?.address ? (
                <DetailRow
                  icon={<MapPin className="h-5 w-5" />}
                  link={Boolean(branch.googleMapsUrl)}
                >
                  {branch.googleMapsUrl ? (
                    <a href={branch.googleMapsUrl} target="_blank" rel="noreferrer">
                      {branch.address}
                    </a>
                  ) : (
                    <span>{branch.address}</span>
                  )}
                </DetailRow>
              ) : null}
            </div>
          </div>

          <div className="flex w-full flex-col px-6 py-6 md:w-2/3 md:px-12 md:py-12">
            <ContactActions
              contactCardUrl={contactCardUrl}
              whatsappTrackingUrl={whatsappTrackingUrl}
              hasWhatsapp={hasWhatsapp}
              monochrome
            />

            <hr className="my-12 border-t border-[#e2e2e2]" />

            <div className="mb-12 flex flex-col gap-3 md:hidden">
              {globalSettings.websiteUrl ? (
                <DetailRow icon={<Globe className="h-5 w-5" />} link>
                  <a href={globalSettings.websiteUrl} target="_blank" rel="noreferrer">
                    {globalSettings.websiteUrl}
                  </a>
                </DetailRow>
              ) : null}
              {globalSettings.instagramUrl ? (
                <DetailRow icon={<Instagram className="h-5 w-5" />} link>
                  <a href={globalSettings.instagramUrl} target="_blank" rel="noreferrer">
                    {globalSettings.instagramUrl}
                  </a>
                </DetailRow>
              ) : null}
              {branch?.address ? (
                <DetailRow
                  icon={<MapPin className="h-5 w-5" />}
                  link={Boolean(branch.googleMapsUrl)}
                >
                  {branch.googleMapsUrl ? (
                    <a href={branch.googleMapsUrl} target="_blank" rel="noreferrer">
                      {branch.address}
                    </a>
                  ) : (
                    <span>{branch.address}</span>
                  )}
                </DetailRow>
              ) : null}
            </div>

            <footer className="mt-auto border-t border-[#cfc4c5] pt-6">
              <p className="text-center text-[12px] font-semibold tracking-[0.1em] text-black uppercase">
                BY CONTACTOACTIVO
              </p>
            </footer>
          </div>
        </section>
      </div>
    </main>
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
  const isSeller = profile.rol === "vendedor";
  const isAdministration = profile.rol === "administracion";
  const [catalog, globalSettings] = await Promise.all([
    isSeller ? getCatalogSettings() : Promise.resolve({ items: [] }),
    getProfileGlobalSettings(),
  ]);

  if (isAdministration) {
    return (
      <AdministrationProfileLayout
        profile={profile}
        globalSettings={globalSettings}
        contactCardUrl={contactCardUrl}
        whatsappTrackingUrl={whatsappTrackingUrl}
        hasWhatsapp={Boolean(whatsappUrl)}
      />
    );
  }

  return (
    <StandardProfileLayout
      profile={profile}
      globalSettings={globalSettings}
      contactCardUrl={contactCardUrl}
      whatsappTrackingUrl={whatsappTrackingUrl}
      hasWhatsapp={Boolean(whatsappUrl)}
      isSeller={isSeller}
      catalogItems={catalog.items}
    />
  );
}
