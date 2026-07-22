import { toNextJsHandler } from "better-auth/next-js";
import type { NextRequest } from "next/server";

import { getAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const auth = await getAuth();

  if (!auth) {
    throw new Error("Failed to initialize authentication.");
  }

  const handler = toNextJsHandler(auth);

  return handler.GET(request);
}

export async function POST(request: NextRequest) {
  const auth = await getAuth();

  if (!auth) {
    throw new Error("Failed to initialize authentication.");
  }

  const handler = toNextJsHandler(auth);

  return handler.POST(request);
}
