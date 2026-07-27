import { z } from "zod";

import { getSessionFromHeaders } from "@/lib/auth-session";
import { deleteReminder, updateReminder } from "@/lib/reminders";

function createUnauthorizedResponse() {
  return Response.json({ error: "No autorizado." }, { status: 401 });
}

export async function PATCH(
  request: Request,
  context: RouteContext<"/api/reminders/[id]">,
) {
  const session = await getSessionFromHeaders(request.headers);

  if (!session) {
    return createUnauthorizedResponse();
  }

  try {
    const { id } = await context.params;
    const body = await request.json();
    const reminder = await updateReminder(session.user.id, id, body);

    if (!reminder) {
      return Response.json(
        { error: "La tarea no existe." },
        { status: 404 },
      );
    }

    return Response.json({ reminder });
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

    console.error("Failed to update reminder", error);

    return Response.json(
      { error: "No se pudo actualizar la tarea." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  context: RouteContext<"/api/reminders/[id]">,
) {
  const session = await getSessionFromHeaders(request.headers);

  if (!session) {
    return createUnauthorizedResponse();
  }

  try {
    const { id } = await context.params;
    const deleted = await deleteReminder(session.user.id, id);

    if (!deleted) {
      return Response.json(
        { error: "La tarea no existe." },
        { status: 404 },
      );
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete reminder", error);

    return Response.json(
      { error: "No se pudo eliminar la tarea." },
      { status: 500 },
    );
  }
}
