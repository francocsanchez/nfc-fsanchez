import { z } from "zod";

import {
  createSessionErrorResponse,
  getSessionResultFromHeaders,
} from "@/lib/auth-session";
import { updateCatalogSettings, getCatalogSettings } from "@/lib/catalog";

export async function GET(request: Request) {
  const sessionResult = await getSessionResultFromHeaders(request.headers);

  if (sessionResult.status !== "authenticated") {
    return createSessionErrorResponse(sessionResult);
  }

  try {
    const catalog = await getCatalogSettings();

    return Response.json({ catalog });
  } catch (error) {
    console.error("Failed to get catalog settings", error);

    return Response.json(
      { error: "No se pudo obtener el catalogo." },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  const sessionResult = await getSessionResultFromHeaders(request.headers);

  if (sessionResult.status !== "authenticated") {
    return createSessionErrorResponse(sessionResult);
  }

  try {
    const body = await request.json();
    const catalog = await updateCatalogSettings(body);

    return Response.json({ catalog });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        {
          error: "La informacion enviada no es valida.",
          fieldErrors: error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    console.error("Failed to update catalog settings", error);

    return Response.json(
      { error: "No se pudo guardar el catalogo." },
      { status: 500 },
    );
  }
}
