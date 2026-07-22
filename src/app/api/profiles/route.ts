import { z } from "zod";

import { getSessionFromHeaders } from "@/lib/auth-session";
import {
  createProfile,
  DuplicateSlugError,
  formatZodError,
  listProfiles,
} from "@/lib/profiles";

function createUnauthorizedResponse() {
  return Response.json({ error: "No autorizado." }, { status: 401 });
}

export async function GET(request: Request) {
  if (!(await getSessionFromHeaders(request.headers))) {
    return createUnauthorizedResponse();
  }

  try {
    const profiles = await listProfiles();

    return Response.json({ profiles });
  } catch (error) {
    console.error("Failed to list profiles", error);

    return Response.json(
      { error: "No se pudieron obtener los perfiles." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  if (!(await getSessionFromHeaders(request.headers))) {
    return createUnauthorizedResponse();
  }

  try {
    const body = await request.json();
    const profile = await createProfile(body);

    return Response.json({ profile }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        {
          error: "La informacion enviada no es valida.",
          fieldErrors: formatZodError(error),
        },
        { status: 400 },
      );
    }

    if (error instanceof DuplicateSlugError) {
      return Response.json({ error: error.message }, { status: 409 });
    }

    console.error("Failed to create profile", error);

    return Response.json(
      { error: "No se pudo crear el perfil." },
      { status: 500 },
    );
  }
}
