import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth/login-form";
import { getCurrentSession } from "@/lib/auth-session";

export default async function LoginPage() {
  const session = await getCurrentSession();

  if (session) {
    redirect("/admin/perfiles");
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7f6f2_0%,#ece8df_100%)] px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-4xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[2rem] border border-black/10 bg-white/90 shadow-[0_20px_60px_rgba(20,20,20,0.08)] backdrop-blur lg:grid-cols-[1.15fr_0.85fr]">
          <section className="bg-zinc-950 p-8 text-white sm:p-10">
            <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.22em] text-zinc-200">
              Acceso interno
            </span>
            <h1 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
              Panel de administracion NFC
            </h1>
            <p className="mt-4 max-w-md text-sm leading-7 text-zinc-300 sm:text-base">
              Inicia sesion para gestionar perfiles, mantener activos los tags
              NFC y editar la informacion publica de cada tarjeta.
            </p>
          </section>

          <section className="p-8 sm:p-10">
            <div className="mx-auto w-full max-w-sm">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
                Login
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-zinc-950">
                Ingresar al admin
              </h2>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Usa tu email y contrasena para continuar.
              </p>

              <div className="mt-8">
                <LoginForm />
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
