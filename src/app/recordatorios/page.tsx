import Link from "next/link";

import { getCurrentSession } from "@/lib/auth-session";

export default async function RemindersLandingPage() {
  const session = await getCurrentSession();
  const ctaHref = session ? "/recordatorios/app" : "/login?next=%2Frecordatorios%2Fapp";
  const ctaLabel = session ? "Abrir app" : "Entrar con mi usuario";

  return (
    <main className="min-h-screen overflow-hidden bg-[#11141b] text-[#f7f0e8]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(242,126,77,0.23),transparent_34%),radial-gradient(circle_at_80%_0%,rgba(255,224,178,0.12),transparent_22%),linear-gradient(180deg,#11141b_0%,#171c25_50%,#0f1218_100%)]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between border-b border-white/10 pb-4">
          <Link
            href="/"
            className="text-xs uppercase tracking-[0.32em] text-[#f6c9ab]/80"
          >
            NFC ecosystem
          </Link>
          <span className="rounded-full border border-[#f27e4d]/30 bg-[#f27e4d]/10 px-3 py-1 text-[0.7rem] uppercase tracking-[0.28em] text-[#ffd8be]">
            PWA activa
          </span>
        </header>

        <section className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:py-14">
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.32em] text-[#ffb48d]">
                Agenda viva
              </p>
              <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-[-0.04em] text-[#fff6ef] sm:text-6xl">
                Una lista simple para no colgar tareas.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-[#d7d2ca] sm:text-lg">
                Entras, agregas una tarea y la marcas como hecha con un check.
                La PWA queda enfocada en mobile y mantiene la pantalla limpia.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href={ctaHref}
                className="inline-flex h-11 items-center justify-center rounded-full bg-[#f27e4d] px-6 text-sm font-semibold text-[#15161b] transition hover:bg-[#ff9468]"
              >
                {ctaLabel}
              </Link>
              <Link
                href="/credenciales/perfiles/admin"
                className="inline-flex h-11 items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 text-sm text-[#f6efe7] transition hover:bg-white/10"
              >
                Volver al panel NFC
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                {
                  label: "Vista",
                  value: "First mobile",
                },
                {
                  label: "Accion",
                  value: "Agregar + check",
                },
                {
                  label: "Formato",
                  value: "Limpio y simple",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-[1.75rem] border border-white/10 bg-white/6 p-4 backdrop-blur"
                >
                  <p className="text-xs uppercase tracking-[0.24em] text-[#f0b79a]/70">
                    {item.label}
                  </p>
                  <p className="mt-3 text-lg font-semibold text-[#fff7f0]">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,248,239,0.08)_0%,rgba(255,248,239,0.03)_100%)] p-4 shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur">
            <div className="rounded-[1.75rem] border border-white/10 bg-[#181d25] p-5">
              <div className="flex items-center justify-between border-b border-white/8 pb-4">
                <div>
                  <p className="text-[0.7rem] uppercase tracking-[0.28em] text-[#ffbc95]">
                    Panel de pulso
                  </p>
                  <p className="mt-2 text-lg font-semibold text-[#fff7ef]">
                    Vista de la app
                  </p>
                </div>
                <span className="rounded-full bg-[#f27e4d]/14 px-3 py-1 text-xs font-medium text-[#ffb8ab]">
                  Minimal
                </span>
              </div>

              <div className="mt-5 space-y-4">
                {[
                  {
                    title: "Llamar a proveedor",
                    note: "Hoy 12:30",
                    status: false,
                  },
                  {
                    title: "Enviar presupuesto",
                    note: "Hoy 13:10",
                    status: false,
                  },
                  {
                    title: "Revisar inventario",
                    note: "Hecha",
                    status: true,
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="grid grid-cols-[auto_1fr] gap-4 rounded-[1.4rem] border border-white/8 bg-[#101319] p-4"
                  >
                    <span
                      className={`mt-1 flex h-5 w-5 items-center justify-center rounded-md border ${
                        item.status
                          ? "border-[#f27e4d] bg-[#f27e4d] text-[#11141b]"
                          : "border-white/20 bg-transparent"
                      }`}
                    >
                      {item.status ? "✓" : ""}
                    </span>
                    <div>
                      <p className="mt-2 text-lg font-semibold text-[#fff8f0]">
                        {item.title}
                      </p>
                      <p className="mt-1 text-sm text-[#a8a29a]">{item.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
