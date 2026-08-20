import Link from "next/link";

import { MetricsDashboardClient } from "@/components/profiles/metrics-dashboard-client";
import { buttonVariants } from "@/components/ui/button";
import { listCredentialMetrics } from "@/lib/credential-metrics";

export const dynamic = "force-dynamic";

export default async function CredentialsProfilesMetricsPage() {
  const metrics = await listCredentialMetrics();

  return (
    <main className="flex w-full flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
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

      <MetricsDashboardClient metrics={metrics} />
    </main>
  );
}
