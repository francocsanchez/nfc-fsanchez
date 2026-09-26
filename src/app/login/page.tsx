import { redirect } from "next/navigation";

import { getCentralLoginUrl } from "@/lib/auth";
import { getCurrentSessionResult } from "@/lib/auth-session";

export default async function LoginPage({
  searchParams,
}: PageProps<"/login">) {
  const params = await searchParams;
  const next =
    typeof params.next === "string" && params.next.startsWith("/")
      ? params.next
      : "/credenciales/perfiles/admin";
  const sessionResult = await getCurrentSessionResult();

  if (sessionResult.status === "authenticated") {
    redirect(next);
  }

  if (sessionResult.status === "forbidden") {
    redirect("/forbidden");
  }

  if (sessionResult.status === "unavailable") {
    redirect("/auth-unavailable");
  }

  redirect(getCentralLoginUrl(next));
}
