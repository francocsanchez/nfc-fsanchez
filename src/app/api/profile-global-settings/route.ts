import { z } from "zod";

import { getSessionFromHeaders } from "@/lib/auth-session";
import {
  getProfileGlobalSettings,
  updateProfileGlobalSettings,
} from "@/lib/profile-global-settings";
import { profileGlobalSettingsSchema } from "@/lib/profile-global-settings-schema";

function createUnauthorizedResponse() {
  return Response.json({ error: "No autorizado." }, { status: 401 });
}

export async function GET(request: Request) {
  if (!(await getSessionFromHeaders(request.headers))) {
    return createUnauthorizedResponse();
  }

  try {
    const settings = await getProfileGlobalSettings();

    return Response.json({ settings });
  } catch (error) {
    console.error("Failed to get profile global settings", error);

    return Response.json(
      { error: "No se pudieron obtener las configuraciones globales." },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  if (!(await getSessionFromHeaders(request.headers))) {
    return createUnauthorizedResponse();
  }

  try {
    const body = profileGlobalSettingsSchema.parse(await request.json());
    const settings = await updateProfileGlobalSettings(body);

    return Response.json({ settings });
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

    console.error("Failed to update profile global settings", error);

    return Response.json(
      { error: "No se pudieron guardar las configuraciones globales." },
      { status: 500 },
    );
  }
}
