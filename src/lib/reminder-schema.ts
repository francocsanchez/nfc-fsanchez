import { z } from "zod";

export const reminderIntervalValues = [5, 10, 15, 30, 60] as const;

const optionalDescriptionField = z
  .string()
  .trim()
  .max(600)
  .optional()
  .or(z.literal(""))
  .transform((value) => value ?? "");

const alertIntervalSchema = z
  .union([z.enum(["5", "10", "15", "30", "60"]), z.literal(""), z.null()])
  .optional()
  .transform((value) => {
    if (!value) {
      return null;
    }

    return Number(value) as (typeof reminderIntervalValues)[number];
  });

const dateSchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Ingresa una fecha valida");

const timeSchema = z
  .string()
  .trim()
  .regex(/^\d{2}:\d{2}$/, "Ingresa una hora valida");

export const createReminderSchema = z.object({
  title: z.string().trim().min(1, "El titulo es obligatorio").max(140),
  description: optionalDescriptionField,
  date: dateSchema,
  time: timeSchema,
  alertIntervalMinutes: alertIntervalSchema,
});

export const updateReminderSchema = createReminderSchema.extend({
  status: z.enum(["pending", "completed"]).optional(),
});

export const updateReminderStatusSchema = z.object({
  status: z.enum(["pending", "completed"]),
});

export type ReminderIntervalMinutes =
  | (typeof reminderIntervalValues)[number]
  | null;

export type CreateReminderInput = z.infer<typeof createReminderSchema>;
export type UpdateReminderInput = z.infer<typeof updateReminderSchema>;
export type UpdateReminderStatusInput = z.infer<
  typeof updateReminderStatusSchema
>;

export type TaskReminderStatus = "pending" | "completed";

export type TaskReminder = {
  id: string;
  userId: string;
  title: string;
  description: string;
  date: string;
  time: string;
  remindAt: string;
  repeatIntervalMinutes: ReminderIntervalMinutes;
  status: TaskReminderStatus;
  completedAt: string | null;
  lastNotifiedAt: string | null;
  nextNotificationAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export function formatReminderZodError(error: z.ZodError) {
  return error.flatten().fieldErrors;
}

export function combineReminderDateTime(date: string, time: string) {
  const [year, month, day] = date.split("-").map(Number);
  const [hours, minutes] = time.split(":").map(Number);

  return new Date(year, month - 1, day, hours, minutes, 0, 0);
}

export function splitReminderDateTime(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  const hours = `${date.getHours()}`.padStart(2, "0");
  const minutes = `${date.getMinutes()}`.padStart(2, "0");

  return {
    date: `${year}-${month}-${day}`,
    time: `${hours}:${minutes}`,
  };
}
