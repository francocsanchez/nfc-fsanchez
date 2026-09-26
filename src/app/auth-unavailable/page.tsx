import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export default function AuthUnavailablePage() {
  return (
    <main className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl items-center">
        <section className="w-full border border-border bg-card p-8 sm:p-12">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Servicio no disponible
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-foreground sm:text-4xl">
            No se pudo conectar con el servicio de autenticacion.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            El panel interno estara disponible cuando se restablezca la conexion.
            Las credenciales publicas no requieren iniciar sesion y continuan
            disponibles.
          </p>
          <Link href="/" className={buttonVariants({ variant: "outline", size: "lg" })}>
            Ir al inicio publico
          </Link>
        </section>
      </div>
    </main>
  );
}
