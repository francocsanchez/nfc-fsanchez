import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { listCredentialMetrics } from "@/lib/credential-metrics";

export const dynamic = "force-dynamic";

export default async function CredentialsProfilesMetricsPage() {
  const metrics = await listCredentialMetrics();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Gestion interna
          </p>
          <div>
            <h1 className="text-2xl font-semibold sm:text-3xl">
              Metricas de credenciales
            </h1>
            
          </div>
        </div>
        <Link
          href="/credenciales/perfiles/admin"
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          Volver a perfiles
        </Link>
      </header>

      <section className="overflow-hidden rounded-3xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-muted/60 text-xs uppercase tracking-[0.16em] text-muted-foreground">
              <tr>
                <th className="px-4 py-4 font-medium">Slug</th>
                <th className="px-4 py-4 font-medium text-center">Mes-Año</th>
             
                <th className="px-4 py-4 font-medium text-center">Guardar contacto</th>
                <th className="px-4 py-4 font-medium text-center">WhatsApp</th>
              </tr>
            </thead>
            <tbody>
              {metrics.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-sm text-muted-foreground"
                  >
                    Todavia no hay metricas registradas.
                  </td>
                </tr>
              ) : null}

              {metrics.map((metric) => (
                <tr
                  key={`${metric.slug}-${metric.anio}-${metric.mes}`}
                  className="border-t border-border"
                >
                  <td className="px-4 py-4 font-medium">{metric.slug}</td>
                  <td className="px-4 py-4 text-sm text-muted-foreground text-center">
                    {metric.mes} - {metric.anio}
                  </td>
                  <td className="px-4 py-4 text-sm text-center">{metric.saveContactClicks}</td>
                  <td className="px-4 py-4 text-sm text-center">{metric.whatsappClicks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
