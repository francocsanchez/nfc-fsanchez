"use server";

import { logoutToCentral } from "@/lib/auth-session";

export async function logoutAction() {
  await logoutToCentral("/");
}
