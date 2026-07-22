import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  ContactRound,
  Link2,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  QrCode,
  Settings,
  Share2,
  UserRound,
} from "lucide-react";

import { getPublicProfileBySlug } from "@/lib/profiles";
import { getPublicProfileUrl } from "@/lib/public-url";

function getWhatsappUrl(whatsapp: string) {
  const digits = whatsapp.replace(/\D/g, "").replace(/^0+/, "");

  return `https://wa.me/549${digits}`;
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

function QuickLinkCard({
  eyebrow,
  title,
  href,
}: {
  eyebrow: string;
  title: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("mailto:") ? undefined : "_blank"}
      rel={href.startsWith("mailto:") ? undefined : "noreferrer"}
      className="group flex items-center justify-between rounded-[2rem] border border-[#e4e2dd] bg-white/65 px-6 py-6 shadow-[0_20px_40px_-18px_rgba(27,28,25,0.1)] transition duration-300 hover:bg-white"
    >
      <div className="min-w-0">
        <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#44474a]">
          {eyebrow}
        </p>
        <p className="mt-2 text-[18px] font-medium tracking-[0.01em] text-[#000101]">
          {title}
        </p>
      </div>
      <ArrowRight className="size-6 shrink-0 text-[#44474a] transition duration-300 group-hover:translate-x-1" />
    </a>
  );
}

function BottomItem({
  icon,
  active = false,
}: {
  icon: React.ReactNode;
  active?: boolean;
}) {
  return (
    <div
      className={
        active
          ? "flex h-12 w-12 items-center justify-center rounded-full bg-[#000101] text-white"
          : "flex h-12 w-12 items-center justify-center rounded-full text-[#44474a]"
      }
    >
      {icon}
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

  const publicUrl = getPublicProfileUrl(profile.slug);
  const whatsappUrl = getWhatsappUrl(profile.whatsapp);
  const initials = getInitials(profile.name);

  return (
    <main
      className="min-h-screen bg-[#fbf9f4] text-[#1b1c19] selection:bg-[#f4dfcb] selection:text-[#241a0e]"
      style={{
        backgroundImage:
          "radial-gradient(circle at 25% 20%, rgba(27,28,25,0.09) 0.8px, transparent 1px), radial-gradient(circle at 75% 35%, rgba(27,28,25,0.06) 0.8px, transparent 1px), radial-gradient(circle at 40% 80%, rgba(27,28,25,0.05) 1px, transparent 1.2px)",
        backgroundSize: "28px 28px, 36px 36px, 44px 44px",
      }}
    >
      <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between bg-[#fbf9f4]/95 px-5 backdrop-blur-sm">
        <button
          type="button"
          aria-label="Menu"
          className="flex h-10 w-10 items-center justify-center text-[#44474a]"
        >
          <Menu className="size-6" strokeWidth={1.8} />
        </button>
        <p className="text-[18px] font-semibold tracking-[-0.02em] text-[#000101]">
          Kinetic
        </p>
        <a
          href={publicUrl}
          aria-label="Compartir perfil"
          className="flex h-10 w-10 items-center justify-center text-[#44474a]"
        >
          <Share2 className="size-5" strokeWidth={1.8} />
        </a>
      </header>

      <div className="mx-auto flex min-h-screen max-w-md flex-col px-5 pb-32 pt-24">
        <section className="mb-10 flex flex-col items-center text-center">
          <div className="relative mb-8">
            <div className="absolute inset-[-8px] rounded-full border border-[#d9c5b2] opacity-60" />
            <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-2 border-[#e4e2dd] bg-[linear-gradient(135deg,#f5f3ee_0%,#ffffff_100%)] shadow-[0_20px_40px_-15px_rgba(27,28,25,0.08)]">
              <span className="text-[40px] font-medium tracking-[-0.03em] text-[#000101]">
                {initials}
              </span>
            </div>
          </div>

          <h1 className="text-[40px] leading-[1.1] tracking-[-0.03em] text-[#000101]">
            {profile.name}
          </h1>
          <p className="mt-2 text-[18px] leading-[1.6] tracking-[0.01em] text-[#44474a]">
            {profile.jobTitle}
          </p>
          <div className="mt-2 flex items-center gap-1 text-[#44474a]/70">
            <MapPin className="size-4" strokeWidth={1.8} />
            {profile.googleMapsUrl ? (
              <a
                href={profile.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[12px] font-semibold uppercase tracking-[0.12em] underline-offset-4 hover:text-[#000101] hover:underline"
              >
                {profile.address}
              </a>
            ) : (
              <span className="text-[12px] font-semibold uppercase tracking-[0.12em]">
                {profile.address}
              </span>
            )}
          </div>
        </section>

        <section className="mb-12 flex flex-col gap-3">
          <a
            href={publicUrl}
            target="_blank"
            rel="noreferrer"
            className="flex h-16 items-center justify-center rounded-[2rem] bg-[#000101] px-6 text-[14px] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] transition active:scale-[0.98]"
          >
            Guardar Contacto
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="flex h-16 items-center justify-center rounded-[2rem] border border-[#c5c6ca] bg-white/50 px-6 text-[14px] font-medium text-[#000101] transition active:scale-[0.98]"
          >
            Mensaje
          </a>
        </section>

        <section className="mb-12 flex justify-center gap-8">
          <a
            href={publicUrl}
            target="_blank"
            rel="noreferrer"
            className="text-[#44474a] transition-colors hover:text-[#000101]"
            aria-label="Abrir enlace publico"
          >
            <Link2 className="size-6" strokeWidth={1.8} />
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="text-[#44474a] transition-colors hover:text-[#000101]"
            aria-label="Abrir WhatsApp"
          >
            <MessageCircle className="size-6" strokeWidth={1.8} />
          </a>
          <Link
            href={`mailto:${profile.email}`}
            className="text-[#44474a] transition-colors hover:text-[#000101]"
            aria-label="Enviar email"
          >
            <Mail className="size-6" strokeWidth={1.8} />
          </Link>
        </section>

        <section className="mb-20 flex flex-col gap-4">
          <QuickLinkCard
            eyebrow="Correo"
            title={profile.email}
            href={`mailto:${profile.email}`}
          />
          <QuickLinkCard
            eyebrow="WhatsApp"
            title={profile.whatsapp}
            href={whatsappUrl}
          />
          <QuickLinkCard
            eyebrow="NFC Route"
            title={`/${profile.slug}`}
            href={publicUrl}
          />
        </section>

        <footer className="mt-auto pb-8 text-center">
          <p className="text-[10px] uppercase tracking-[0.24em] text-[#44474a]/40">
            Powered by NFC Profiles
          </p>
        </footer>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-50 mx-auto flex max-w-md items-center justify-around rounded-t-[1.5rem] bg-[#f0eee9] px-5 py-4 shadow-[0_-6px_24px_rgba(27,28,25,0.05)] md:hidden">
        <BottomItem icon={<UserRound className="size-5" strokeWidth={1.9} />} active />
        <BottomItem icon={<ContactRound className="size-5" strokeWidth={1.9} />} />
        <BottomItem icon={<QrCode className="size-5" strokeWidth={1.9} />} />
        <BottomItem icon={<Settings className="size-5" strokeWidth={1.9} />} />
      </nav>
    </main>
  );
}
