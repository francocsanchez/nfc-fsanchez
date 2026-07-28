import Link from "next/link";
import { ArrowUpRight, BellRing, CreditCard } from "lucide-react";

const apps = [
  {
    href: "/credenciales/perfiles/admin",
    name: "Credenciales",
    subtitle: "Perfiles NFC",
    description:
      "Administra altas, ediciones y estados de los perfiles publicos desde una sola vista.",
    icon: CreditCard,
    tone: "bg-foreground text-background",
    accent: "text-background/70",
    action:
      "Abrir panel",
  },
  {
    href: "/recordatorios",
    name: "Recordatorios",
    subtitle: "Tareas insistentes",
    description:
      "Entra a la app de recordatorios y continua con la experiencia mobile-first del modulo.",
    icon: BellRing,
    tone: "border border-border bg-card text-card-foreground",
    accent: "text-muted-foreground",
    action: "Entrar a la app",
  },
] as const;

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <div className="relative flex flex-1 flex-col justify-between overflow-hidden border border-border bg-background">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02)_0%,transparent_18%,transparent_100%)]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-foreground/10" />

          <section className="relative border-b border-border px-6 py-12 sm:px-10 sm:py-16 lg:px-14">
            <div className="max-w-3xl space-y-6">
              <span className="inline-flex text-[0.72rem] font-medium uppercase tracking-[0.34em] text-muted-foreground">
                Inicio
              </span>
              <div className="space-y-4">
                <h1 className="max-w-2xl text-4xl font-semibold tracking-[-0.06em] text-foreground sm:text-5xl lg:text-6xl">
                  Dos accesos claros para entrar y seguir trabajando.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                  Esta portada funciona como punto de entrada rapido para las
                  dos superficies activas del proyecto: credenciales NFC y
                  recordatorios.
                </p>
              </div>
            </div>
          </section>

          <section className="relative grid gap-px bg-border md:grid-cols-2">
            {apps.map((app) => {
              const Icon = app.icon;

              return (
                <Link
                  key={app.name}
                  href={app.href}
                  className={`group relative flex min-h-[18rem] flex-col justify-between px-6 py-6 transition sm:px-10 sm:py-8 ${app.tone}`}
                >
                  <div className="space-y-10">
                    <div className="flex items-start justify-between gap-4">
                      <span className="inline-flex h-11 w-11 items-center justify-center border border-current/15">
                        <Icon className="h-5 w-5" />
                      </span>
                      <ArrowUpRight className="h-5 w-5 transition duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </div>

                    <div className="space-y-3">
                      <p className={`text-[0.72rem] uppercase tracking-[0.3em] ${app.accent}`}>
                        {app.subtitle}
                      </p>
                      <h2 className="text-3xl font-semibold tracking-[-0.05em]">
                        {app.name}
                      </h2>
                      <p
                        className={`max-w-md text-sm leading-7 sm:text-base ${
                          app.name === "Credenciales"
                            ? "text-background/78"
                            : "text-muted-foreground"
                        }`}
                      >
                        {app.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-current/10 pt-5 text-sm uppercase tracking-[0.22em]">
                    <span>{app.action}</span>
                    <span className={app.accent}>Disponible</span>
                  </div>
                </Link>
              );
            })}
          </section>

          <footer className="relative flex flex-col gap-3 px-6 py-5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-14">
            <p>Entrada principal del proyecto.</p>
            <p>Simple, limpia y enfocada en acceso rapido.</p>
          </footer>
        </div>
      </div>
    </main>
  );
}
