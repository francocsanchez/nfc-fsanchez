import { z } from "zod";

import {
  formatZodError,
  getProfileById,
  updateProfile,
} from "@/lib/profiles";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const profile = await getProfileById(id);

    if (!profile) {
      return Response.json(
        { error: "Perfil no encontrado." },
        { status: 404 },
      );
    }

    return Response.json({ profile });
  } catch (error) {
    console.error("Failed to get profile", error);

    return Response.json(
      { error: "No se pudo obtener el perfil." },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const profile = await updateProfile(id, body);

    if (!profile) {
      return Response.json(
        { error: "Perfil no encontrado." },
        { status: 404 },
      );
    }

    return Response.json({ profile });
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

    console.error("Failed to update profile", error);

    return Response.json(
      { error: "No se pudo actualizar el perfil." },
      { status: 500 },
    );
  }
}
