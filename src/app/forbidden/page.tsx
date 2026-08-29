import Link from "next/link";

import { logoutAction } from "@/app/login/actions";
import { Button, buttonVariants } from "@/components/ui/button";

export default function ForbiddenPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center">
        <div className="border border-border bg-background p-8 sm:p-12">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="space-y-5">
              <span className="inline-flex text-[0.72rem] font-medium uppercase tracking-[0.34em] text-muted-foreground">
                Acceso restringido
              </span>
              <div className="space-y-4">
                <h1 className="max-w-2xl text-4xl font-semibold tracking-[-0.06em] text-foreground sm:text-5xl">
                  Tu sesion existe, pero esta app no esta habilitada para ese usuario.
                </h1>
                <p className="max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
                  Auth Central confirmo la identidad, pero no devolvio acceso valido
                  para esta aplicacion. Si necesitas entrar al panel NFC, revisa el
                  permiso de la app o inicia sesion con otra cuenta.
                </p>
              </div>
            </section>

            <section className="flex items-center">
              <div className="w-full space-y-4 border border-border bg-card p-5 sm:p-6">
                <p className="text-sm leading-7 text-muted-foreground">
                  Puedes volver al inicio publico o cerrar la sesion central para
                  cambiar de cuenta.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/"
                    className={buttonVariants({ variant: "outline", size: "lg" })}
                  >
                    Ir al inicio
                  </Link>
                  <form action={logoutAction}>
                    <Button type="submit" size="lg">
                      Cerrar sesion central
                    </Button>
                  </form>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
