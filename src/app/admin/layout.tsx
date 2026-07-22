import type { ReactNode } from "react";

import { logoutAction } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { requireAdminSession } from "@/lib/auth-session";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireAdminSession();

  return (
    <>
      <div className="border-b border-black/10 bg-white/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
              NFC platform
            </p>
            <p className="text-sm font-semibold text-zinc-950">
              Panel interno
            </p>
          </div>
          <form action={logoutAction}>
            <Button type="submit" variant="outline" size="sm">
              Cerrar sesion
            </Button>
          </form>
        </div>
      </div>
      {children}
    </>
  );
}
