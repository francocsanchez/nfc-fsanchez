import { z } from "zod";

import { getSessionFromHeaders } from "@/lib/auth-session";
import { getPushPublicKey, isPushConfigured } from "@/lib/push";
import {
  deletePushSubscription,
  listPushSubscriptionsByUser,
  upsertPushSubscription,
} from "@/lib/reminders";

const pushSubscriptionSchema = z.object({
  endpoint: z.string().url(),
  expirationTime: z.number().nullable().optional(),
  keys: z.object({
    p256dh: z.string().min(1),
    auth: z.string().min(1),
  }),
});

const deletePushSubscriptionSchema = z.object({
  endpoint: z.string().url(),
});

function createUnauthorizedResponse() {
  return Response.json({ error: "No autorizado." }, { status: 401 });
}

export async function GET(request: Request) {
  const session = await getSessionFromHeaders(request.headers);

  if (!session) {
    return createUnauthorizedResponse();
  }

  try {
    const subscriptions = await listPushSubscriptionsByUser(session.user.id);

    return Response.json({
      subscriptions,
      isPushConfigured: isPushConfigured(),
      publicKey: getPushPublicKey(),
    });
  } catch (error) {
    console.error("Failed to list push subscriptions", error);

    return Response.json(
      { error: "No se pudieron obtener las suscripciones push." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const session = await getSessionFromHeaders(request.headers);

  if (!session) {
    return createUnauthorizedResponse();
  }

  if (!isPushConfigured()) {
    return Response.json(
      {
        error:
          "Las push notifications todavia no estan configuradas en el servidor.",
      },
      { status: 503 },
    );
  }

  try {
    const body = pushSubscriptionSchema.parse(await request.json());
    const subscription = await upsertPushSubscription(
      session.user.id,
      body,
      request.headers.get("user-agent") ?? "",
    );

    return Response.json({ subscription }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        {
          error: "La suscripcion push no es valida.",
          fieldErrors: error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    console.error("Failed to save push subscription", error);

    return Response.json(
      { error: "No se pudo guardar la suscripcion push." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  const session = await getSessionFromHeaders(request.headers);

  if (!session) {
    return createUnauthorizedResponse();
  }

  try {
    const body = deletePushSubscriptionSchema.parse(await request.json());
    const deleted = await deletePushSubscription(session.user.id, body.endpoint);

    return Response.json({ ok: deleted });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        {
          error: "La suscripcion push no es valida.",
          fieldErrors: error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    console.error("Failed to delete push subscription", error);

    return Response.json(
      { error: "No se pudo eliminar la suscripcion push." },
      { status: 500 },
    );
  }
}
