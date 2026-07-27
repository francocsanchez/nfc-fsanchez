import { z } from "zod";

import { getSessionFromHeaders } from "@/lib/auth-session";
import { setReminderStatus } from "@/lib/reminders";
import { updateReminderStatusSchema } from "@/lib/reminder-schema";

function createUnauthorizedResponse() {
  return Response.json({ error: "No autorizado." }, { status: 401 });
}

export async function POST(
  request: Request,
  context: RouteContext<"/api/reminders/[id]/status">,
) {
  const session = await getSessionFromHeaders(request.headers);

  if (!session) {
    return createUnauthorizedResponse();
  }

  try {
    const { id } = await context.params;
    const body = updateReminderStatusSchema.parse(await request.json());
    const reminder = await setReminderStatus(session.user.id, id, body.status);

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
          error: "El estado enviado no es valido.",
          fieldErrors: error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    console.error("Failed to change reminder status", error);

    return Response.json(
      { error: "No se pudo actualizar el estado." },
      { status: 500 },
    );
  }
}
