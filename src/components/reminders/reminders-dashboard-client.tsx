"use client";

import { Check, Plus } from "lucide-react";
import { startTransition, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  createReminderSchema,
  reminderIntervalValues,
  type TaskReminder,
} from "@/lib/reminder-schema";

type RemindersDashboardClientProps = {
  initialReminders: TaskReminder[];
  userName: string;
  pushPublicKey: string;
  pushConfigured: boolean;
};

type FieldErrors = Partial<
  Record<"title" | "description" | "date" | "time" | "alertIntervalMinutes", string[]>
>;

type ReminderFormValues = {
  title: string;
  description: string;
  date: string;
  time: string;
  alertIntervalMinutes: "" | "5" | "10" | "15" | "30" | "60";
};

type ApiErrorResponse = {
  error?: string;
  fieldErrors?: FieldErrors;
};

const intervalLabels: Record<string, string> = {
  "5": "Cada 5 min",
  "10": "Cada 10 min",
  "15": "Cada 15 min",
  "30": "Cada 30 min",
  "60": "Cada 1 hora",
};

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Ocurrio un error inesperado.";
}

function formatDateTime(remindAt: string) {
  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(remindAt));
}

function getDefaultFormValues(): ReminderFormValues {
  const now = new Date();
  const date = `${now.getFullYear()}-${`${now.getMonth() + 1}`.padStart(2, "0")}-${`${now.getDate()}`.padStart(2, "0")}`;
  const time = `${`${now.getHours()}`.padStart(2, "0")}:${`${now.getMinutes()}`.padStart(2, "0")}`;

  return {
    title: "",
    description: "",
    date,
    time,
    alertIntervalMinutes: "",
  };
}

export function RemindersDashboardClient({
  initialReminders,
  userName,
  pushPublicKey,
  pushConfigured,
}: RemindersDashboardClientProps) {
  const [reminders, setReminders] = useState(initialReminders);
  const [formValues, setFormValues] = useState<ReminderFormValues>(
    getDefaultFormValues,
  );
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [showDescription, setShowDescription] = useState(false);
  const [pushBusy, setPushBusy] = useState(false);
  const [pushStatusMessage, setPushStatusMessage] = useState<string | null>(null);

  async function refreshReminders() {
    const response = await fetch("/api/reminders", { cache: "no-store" });
    const data = (await response.json()) as { reminders?: TaskReminder[] } & ApiErrorResponse;

    if (!response.ok || !data.reminders) {
      throw new Error(data.error ?? "No se pudo recargar la lista.");
    }

    startTransition(() => {
      setReminders(data.reminders ?? []);
    });
  }

  async function ensurePushSubscription() {
    if (!pushConfigured || !pushPublicKey) {
      return;
    }

    if (
      typeof window === "undefined" ||
      !("Notification" in window) ||
      !("serviceWorker" in navigator) ||
      !("PushManager" in window)
    ) {
      return;
    }

    if (Notification.permission !== "granted") {
      return;
    }

    const registration = await navigator.serviceWorker.register("/recordatorios-sw.js");
    const existingSubscription = await registration.pushManager.getSubscription();

    if (existingSubscription) {
      return;
    }

    const padding = "=".repeat((4 - (pushPublicKey.length % 4)) % 4);
    const normalized = (pushPublicKey + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const rawData = window.atob(normalized);
    const applicationServerKey = Uint8Array.from(rawData, (char) =>
      char.charCodeAt(0),
    );

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    });

    const json = subscription.toJSON();

    await fetch("/api/push-subscriptions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        endpoint: subscription.endpoint,
        expirationTime: json.expirationTime ?? null,
        keys: {
          p256dh: json.keys?.p256dh ?? "",
          auth: json.keys?.auth ?? "",
        },
      }),
    });
  }

  async function enableNotifications() {
    if (!pushConfigured) {
      setPushStatusMessage(
        "Las notificaciones push todavia no estan configuradas en el servidor.",
      );
      return;
    }

    if (
      typeof window === "undefined" ||
      !("Notification" in window) ||
      !("serviceWorker" in navigator) ||
      !("PushManager" in window)
    ) {
      setPushStatusMessage(
        "Este navegador no soporta notificaciones push en esta PWA.",
      );
      return;
    }

    setPushBusy(true);
    setPushStatusMessage(null);

    try {
      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        setPushStatusMessage(
          permission === "denied"
            ? "Debes habilitar las notificaciones desde el navegador."
            : "No se concedio el permiso de notificaciones.",
        );
        return;
      }

      await ensurePushSubscription();
      setPushStatusMessage("Notificaciones activadas correctamente.");
    } catch (error) {
      setPushStatusMessage(getErrorMessage(error));
    } finally {
      setPushBusy(false);
    }
  }

  async function submitReminder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});
    setSubmitError(null);

    const payload = {
      title: formValues.title,
      description: formValues.description,
      date: formValues.date,
      time: formValues.time,
      alertIntervalMinutes: formValues.alertIntervalMinutes,
    };

    const parsed = createReminderSchema.safeParse(payload);

    if (!parsed.success) {
      setFieldErrors(parsed.error.flatten().fieldErrors);
      return;
    }

    setSubmitting(true);

    try {
      await ensurePushSubscription();

      const response = await fetch("/api/reminders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as ApiErrorResponse;

      if (!response.ok) {
        setFieldErrors(data.fieldErrors ?? {});
        setSubmitError(data.error ?? "No se pudo guardar la tarea.");
        return;
      }

      setFormValues(getDefaultFormValues());
      setShowDescription(false);
      await refreshReminders();
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  async function updateReminderStatus(id: string, status: "pending" | "completed") {
    setBusyId(id);
    setSubmitError(null);

    try {
      const response = await fetch(`/api/reminders/${id}/status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = (await response.json()) as ApiErrorResponse;

      if (!response.ok) {
        throw new Error(data.error ?? "No se pudo actualizar el estado.");
      }

      await refreshReminders();
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    } finally {
      setBusyId(null);
    }
  }

  const sortedReminders = [...reminders].sort((first, second) => {
    if (first.status !== second.status) {
      return first.status === "pending" ? -1 : 1;
    }

    return new Date(first.remindAt).getTime() - new Date(second.remindAt).getTime();
  });

  return (
    <main className="min-h-screen bg-[#f6f1ea] px-3 py-4 text-[#171717] sm:px-4">
      <div className="mx-auto flex w-full max-w-md flex-col gap-4">
        <section className="rounded-[1.75rem] bg-white p-4 shadow-[0_14px_40px_rgba(23,23,23,0.08)]">
          <Button
            type="button"
            size="lg"
            onClick={enableNotifications}
            disabled={pushBusy}
            className="h-12 w-full rounded-[1.15rem] bg-[#1f1f1f] text-white hover:bg-[#2b2b2b]"
          >
            {pushBusy ? "Activando..." : "Activar notificaciones"}
          </Button>
          {pushStatusMessage ? (
            <p className="mt-3 text-sm leading-6 text-[#66615a]">
              {pushStatusMessage}
            </p>
          ) : null}
        </section>

        <header className="rounded-[1.75rem] bg-white p-4 shadow-[0_14px_40px_rgba(23,23,23,0.08)]">
          <p className="text-[0.72rem] uppercase tracking-[0.26em] text-[#c1774e]">
            Recordatorios
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
            Hola, {userName}
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#66615a]">
            Agrega una tarea y marquela como hecha cuando la completes.
          </p>
        </header>

        <section className="rounded-[1.75rem] bg-white p-4 shadow-[0_14px_40px_rgba(23,23,23,0.08)]">
          <form className="space-y-3" onSubmit={submitReminder}>
            <input
              value={formValues.title}
              onChange={(event) =>
                setFormValues((current) => ({
                  ...current,
                  title: event.target.value,
                }))
              }
              className="w-full rounded-[1.15rem] border border-[#ece4d9] bg-[#fcfaf7] px-4 py-3 text-sm outline-none transition focus:border-[#d68b61] focus:ring-4 focus:ring-[#d68b61]/12"
              placeholder="Titulo de la tarea"
            />
            {fieldErrors.title?.[0] ? (
              <p className="text-sm text-[#c15b4b]">{fieldErrors.title[0]}</p>
            ) : null}

            {showDescription ? (
              <div className="space-y-2">
                <textarea
                  value={formValues.description}
                  onChange={(event) =>
                    setFormValues((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  className="min-h-24 w-full rounded-[1.15rem] border border-[#ece4d9] bg-[#fcfaf7] px-4 py-3 text-sm outline-none transition focus:border-[#d68b61] focus:ring-4 focus:ring-[#d68b61]/12"
                  placeholder="Descripcion opcional"
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowDescription(false);
                    setFormValues((current) => ({
                      ...current,
                      description: "",
                    }));
                  }}
                  className="text-xs font-medium uppercase tracking-[0.18em] text-[#9f6b4f]"
                >
                  Ocultar descripcion
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowDescription(true)}
                className="text-left text-xs font-medium uppercase tracking-[0.18em] text-[#9f6b4f]"
              >
                + Descripcion
              </button>
            )}

            <div className="grid grid-cols-1 gap-3">
              <div>
                <input
                  type="date"
                  value={formValues.date}
                  onChange={(event) =>
                    setFormValues((current) => ({
                      ...current,
                      date: event.target.value,
                    }))
                  }
                  className="w-full rounded-[1.15rem] border border-[#ece4d9] bg-[#fcfaf7] px-4 py-3 text-sm outline-none transition focus:border-[#d68b61] focus:ring-4 focus:ring-[#d68b61]/12"
                />
                {fieldErrors.date?.[0] ? (
                  <p className="mt-1 text-sm text-[#c15b4b]">{fieldErrors.date[0]}</p>
                ) : null}
              </div>
              <div>
                <input
                  type="time"
                  value={formValues.time}
                  onChange={(event) =>
                    setFormValues((current) => ({
                      ...current,
                      time: event.target.value,
                    }))
                  }
                  className="w-full rounded-[1.15rem] border border-[#ece4d9] bg-[#fcfaf7] px-4 py-3 text-sm outline-none transition focus:border-[#d68b61] focus:ring-4 focus:ring-[#d68b61]/12"
                />
                {fieldErrors.time?.[0] ? (
                  <p className="mt-1 text-sm text-[#c15b4b]">{fieldErrors.time[0]}</p>
                ) : null}
              </div>
            </div>

            <div>
              <select
                value={formValues.alertIntervalMinutes}
                onChange={(event) =>
                  setFormValues((current) => ({
                    ...current,
                    alertIntervalMinutes: event.target.value as ReminderFormValues["alertIntervalMinutes"],
                  }))
                }
                className="w-full rounded-[1.15rem] border border-[#ece4d9] bg-[#fcfaf7] px-4 py-3 text-sm outline-none transition focus:border-[#d68b61] focus:ring-4 focus:ring-[#d68b61]/12"
              >
                <option value="">Sin alerta repetitiva</option>
                {reminderIntervalValues.map((interval) => (
                  <option key={interval} value={interval}>
                    {intervalLabels[`${interval}`]}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs leading-5 text-[#7a746c]">
                Al vencer, la tarea vuelve a notificar con este intervalo hasta
                que la marques como hecha.
              </p>
            </div>

            {submitError ? (
              <div className="rounded-[1.15rem] border border-[#f0cdc5] bg-[#fff2ef] px-4 py-3 text-sm text-[#b75040]">
                {submitError}
              </div>
            ) : null}

            <Button
              type="submit"
              size="lg"
              disabled={submitting}
              className="h-12 w-full rounded-[1.15rem] bg-[#1f1f1f] text-white hover:bg-[#2b2b2b]"
            >
              <Plus className="size-4" />
              {submitting ? "Agregando..." : "Agregar tarea"}
            </Button>
          </form>
        </section>

        <section className="rounded-[1.75rem] bg-white p-3 shadow-[0_14px_40px_rgba(23,23,23,0.08)]">
          <div className="px-1 pb-2">
            <p className="text-sm font-medium text-[#2a2a2a]">Listado de tareas</p>
          </div>

          <div className="space-y-2">
            {sortedReminders.length === 0 ? (
              <div className="rounded-[1.15rem] border border-dashed border-[#e7ddcf] bg-[#fcfaf7] px-4 py-8 text-center text-sm text-[#7a746c]">
                Todavia no hay tareas cargadas.
              </div>
            ) : null}

            {sortedReminders.map((reminder) => {
              const busy = busyId === reminder.id;
              const completed = reminder.status === "completed";

              return (
                <button
                  key={reminder.id}
                  type="button"
                  onClick={() =>
                    updateReminderStatus(
                      reminder.id,
                      completed ? "pending" : "completed",
                    )
                  }
                  disabled={busy}
                  className="flex w-full items-center gap-3 rounded-[1.15rem] border border-[#eee4d8] bg-[#fcfaf7] px-3 py-3 text-left transition hover:bg-[#f9f3ec] disabled:opacity-60"
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition ${
                      completed
                        ? "border-[#1f1f1f] bg-[#1f1f1f] text-white"
                        : "border-[#d8cdbc] bg-white text-transparent"
                    }`}
                  >
                    <Check className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block text-sm font-medium ${
                        completed ? "text-[#91897f] line-through" : "text-[#171717]"
                      }`}
                    >
                      {reminder.title}
                    </span>
                  <span className="mt-1 block text-xs text-[#7d756c]">
                    {formatDateTime(reminder.remindAt)}
                  </span>
                  {reminder.description ? (
                    <span className="mt-1 block text-xs text-[#7d756c]">
                      {reminder.description}
                    </span>
                  ) : null}
                  {reminder.repeatIntervalMinutes ? (
                    <span className="mt-1 block text-[11px] uppercase tracking-[0.16em] text-[#9f6b4f]">
                      {intervalLabels[`${reminder.repeatIntervalMinutes}`]}
                    </span>
                  ) : null}
                </span>
              </button>
            );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
