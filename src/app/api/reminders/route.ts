import { z } from "zod";

import { getSessionFromHeaders } from "@/lib/auth-session";
import {
  createReminder,
  formatReminderZodError,
  listRemindersByUser,
} from "@/lib/reminders";

function createUnauthorizedResponse() {
  return Response.json({ error: "No autorizado." }, { status: 401 });
}

export async function GET(request: Request) {
  const session = await getSessionFromHeaders(request.headers);

  if (!session) {
    return createUnauthorizedResponse();
  }

  try {
    const reminders = await listRemindersByUser(session.user.id);

    return Response.json({ reminders });
  } catch (error) {
    console.error("Failed to list reminders", error);

    return Response.json(
      { error: "No se pudieron obtener las tareas." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const session = await getSessionFromHeaders(request.headers);

  if (!session) {
    return createUnauthorizedResponse();
  }

  try {
    const body = await request.json();
    const reminder = await createReminder(session.user.id, body);

    return Response.json({ reminder }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        {
          error: "La informacion enviada no es valida.",
          fieldErrors: formatReminderZodError(error),
        },
        { status: 400 },
      );
    }

    console.error("Failed to create reminder", error);

    return Response.json(
      { error: "No se pudo crear la tarea." },
      { status: 500 },
    );
  }
}
