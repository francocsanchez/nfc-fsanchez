import Link from "next/link";
import { redirect } from "next/navigation";

import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { getCurrentSession } from "@/lib/auth-session";

export default async function NewPasswordPage({
  searchParams,
}: PageProps<"/recuperar-password/nueva">) {
  const session = await getCurrentSession();
  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token : "";

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
                  Nueva contrasena
                </span>
                <div className="space-y-4">
                  <h1 className="max-w-2xl text-4xl font-semibold tracking-[-0.06em] text-foreground sm:text-5xl">
                    Definir una contrasena nueva.
                  </h1>
                  <p className="max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
                    Este paso confirma el acceso al enlace recibido por email y
                    reemplaza la contrasena anterior por una nueva credencial
                    para el panel administrativo.
                  </p>
                </div>
              </div>

              <div className="mt-10 grid gap-px bg-border sm:grid-cols-3 lg:mt-0">
                {[
                  { label: "Minimo", value: "8 caracteres" },
                  { label: "Seguridad", value: "Sesiones revocadas" },
                  { label: "Flujo", value: "Retorno al login" },
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
                    Credencial nueva
                  </p>
                  <h2 className="text-3xl font-semibold tracking-[-0.05em] text-foreground">
                    Restablecer contrasena
                  </h2>
                  <p className="text-sm leading-7 text-muted-foreground">
                    El enlace funciona con un token de un solo uso. Si ya no es
                    valido, solicita uno nuevo desde la pantalla anterior.
                  </p>
                </div>

                <div className="border border-border bg-card p-5 sm:p-6">
                  {token ? (
                    <ResetPasswordForm token={token} />
                  ) : (
                    <div className="space-y-4">
                      <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        El enlace no incluye un token valido. Solicita una nueva
                        recuperacion desde el login.
                      </div>
                      <Link
                        href="/recuperar-password"
                        className="block text-sm text-muted-foreground transition hover:text-foreground"
                      >
                        Solicitar un nuevo enlace
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
