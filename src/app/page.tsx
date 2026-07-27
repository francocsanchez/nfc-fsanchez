import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7f6f2_0%,#ece8df_100%)] px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-5xl flex-col justify-between rounded-[2rem] border border-black/10 bg-white/90 p-6 shadow-[0_20px_60px_rgba(20,20,20,0.08)] backdrop-blur sm:p-10">
        <div className="space-y-8">
          <div className="space-y-4">
            <span className="inline-flex rounded-full border border-black/10 bg-black/5 px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.22em] text-zinc-700">
              NFC platform
            </span>
            <div className="max-w-2xl space-y-3">
              <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
                Gestion de perfiles para tags NFC
              </h1>
              <p className="text-base leading-7 text-zinc-600 sm:text-lg">
                Esta primera version ya resuelve el CRUD interno de perfiles y
                la landing publica mobile-first que se abre al escanear cada
                tag.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href="/admin/perfiles"
              className="rounded-[1.75rem] bg-zinc-950 p-6 text-white transition hover:bg-zinc-800"
            >
              <p className="text-sm uppercase tracking-[0.24em] text-zinc-400">
                Administracion
              </p>
              <h2 className="mt-3 text-2xl font-semibold">Ir al CRUD</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-300">
                Crear, editar, activar y desactivar perfiles desde una sola
                tabla con modal.
              </p>
            </Link>

            <Link
              href="/recordatorios"
              className="rounded-[1.75rem] border border-[#d9b8a6] bg-[linear-gradient(145deg,#fff5ef_0%,#fffdf9_100%)] p-6 transition hover:border-[#c98b6a] hover:shadow-[0_18px_40px_rgba(201,139,106,0.16)]"
            >
              <p className="text-sm uppercase tracking-[0.24em] text-[#9c5e3d]">
                Micro SaaS PWA
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-zinc-950">
                Recordatorios recurrentes
              </h2>
              <p className="mt-2 text-sm leading-6 text-zinc-700">
                Un segundo producto dentro del proyecto: tareas con push
                insistente hasta completarlas.
              </p>
            </Link>
          </div>
        </div>

        <p className="mt-10 text-sm text-zinc-500">
          La plataforma ahora convive con dos superficies: perfiles NFC y la
          nueva PWA de recordatorios.
        </p>
      </div>
    </main>
  );
}
