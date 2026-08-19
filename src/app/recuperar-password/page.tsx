import Link from "next/link";
import { redirect } from "next/navigation";

import { RequestPasswordResetForm } from "@/components/auth/request-password-reset-form";
import { getCurrentSession } from "@/lib/auth-session";

export default async function PasswordRecoveryPage() {
  const session = await getCurrentSession();

  if (session) {
    redirect("/credenciales/perfiles/admin");
  }

  return (
    <main className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col">
        <div className="relative flex flex-1 overflow-hidden border border-border bg-background">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02)_0%,transparent_18%,transparent_100%)]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-foreground/10" />

          <div className="relative grid flex-1 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="flex flex-col justify-between border-b border-border px-6 py-8 sm:px-10 sm:py-10 lg:border-b-0 lg:border-r lg:px-14 lg:py-14">
              <div className="space-y-6">
                <span className="inline-flex text-[0.72rem] font-medium uppercase tracking-[0.34em] text-muted-foreground">
                  Recuperacion
                </span>
                <div className="space-y-4">
                  <h1 className="max-w-2xl text-4xl font-semibold tracking-[-0.06em] text-foreground sm:text-5xl">
                    Restablecer acceso al panel.
                  </h1>
                  <p className="max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
                    Ingresa el email de tu cuenta. Si existe en el sistema, te
                    enviamos un enlace para definir una nueva contrasena sin
                    exponer informacion sobre usuarios internos.
                  </p>
                </div>
              </div>

              <div className="mt-10 grid gap-px bg-border sm:grid-cols-3 lg:mt-0">
                {[
                  { label: "Canal", value: "Email SMTP" },
                  { label: "Respuesta", value: "Mensaje discreto" },
                  { label: "Destino", value: "Login interno" },
                ].map((item) => (
                  <div key={item.label} className="bg-background px-4 py-5 sm:px-5">
                    <p className="text-[0.72rem] uppercase tracking-[0.28em] text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="mt-3 text-base font-semibold tracking-[-0.03em] text-foreground">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="flex items-center px-6 py-8 sm:px-10 sm:py-10 lg:px-12 lg:py-14">
              <div className="w-full max-w-md space-y-6">
                <div className="space-y-3">
                  <p className="text-[0.72rem] font-medium uppercase tracking-[0.3em] text-muted-foreground">
                    Email de recuperacion
                  </p>
                  <h2 className="text-3xl font-semibold tracking-[-0.05em] text-foreground">
                    Enviar enlace
                  </h2>
                  <p className="text-sm leading-7 text-muted-foreground">
                    El enlace te permite crear una contrasena nueva. Si no
                    recuerdas haber solicitado esto, no se realiza ningun
                    cambio hasta confirmar el formulario final.
                  </p>
                </div>

                <div className="border border-border bg-card p-5 sm:p-6">
                  <RequestPasswordResetForm />
                </div>

                <Link
                  href="/login"
                  className="block text-sm text-muted-foreground transition hover:text-foreground"
                >
                  Volver al login
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
