import { processDueReminderNotifications } from "@/lib/reminder-worker";

function isAuthorized(request: Request) {
  const expectedSecret = process.env.REMINDERS_CRON_SECRET;

  if (!expectedSecret) {
    return false;
  }

  const providedSecret =
    request.headers.get("x-reminders-secret") ??
    new URL(request.url).searchParams.get("secret");

  return providedSecret === expectedSecret;
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return Response.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const result = await processDueReminderNotifications();

    return Response.json(result);
  } catch (error) {
    console.error("Failed to process due reminders", error);

    return Response.json(
      { error: "No se pudieron procesar los recordatorios." },
      { status: 500 },
    );
  }
}
