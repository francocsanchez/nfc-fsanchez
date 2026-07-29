import { z } from "zod";

import {
  buildCatalogWorkbookBuffer,
  parseCatalogWorkbookBuffer,
} from "@/lib/catalog-excel";
import { getSessionFromHeaders } from "@/lib/auth-session";
import { getCatalogSettings, updateCatalogSettings } from "@/lib/catalog";

function createUnauthorizedResponse() {
  return Response.json({ error: "No autorizado." }, { status: 401 });
}

export async function GET(request: Request) {
  if (!(await getSessionFromHeaders(request.headers))) {
    return createUnauthorizedResponse();
  }

  try {
    const catalog = await getCatalogSettings();
    const fileBuffer = buildCatalogWorkbookBuffer(catalog);

    return new Response(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="catalogo-vendedores.xlsx"',
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Failed to export catalog workbook", error);

    return Response.json(
      { error: "No se pudo descargar el catalogo." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  if (!(await getSessionFromHeaders(request.headers))) {
    return createUnauthorizedResponse();
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return Response.json(
        { error: "Debes seleccionar un archivo Excel valido." },
        { status: 400 },
      );
    }

    const catalog = parseCatalogWorkbookBuffer(await file.arrayBuffer());
    const updatedCatalog = await updateCatalogSettings(catalog);

    return Response.json({ catalog: updatedCatalog });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        {
          error:
            "El Excel no tiene el formato esperado. Usa las columnas: url foto, nombre, url ficha tecnica.",
          fieldErrors: error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    console.error("Failed to import catalog workbook", error);

    return Response.json(
      { error: "No se pudo importar el catalogo." },
      { status: 500 },
    );
  }
}
