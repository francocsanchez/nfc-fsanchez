import { z } from "zod";

const optionalWebsiteUrlField = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
  .transform((value) => value ?? "")
  .refine((value) => value === "" || /^https?:\/\//i.test(value), {
    message: "Ingresa un link valido",
  });

const optionalInstagramUrlField = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
  .transform((value) => value ?? "")
  .refine(
    (value) =>
      value === "" ||
      /^https?:\/\/(www\.)?instagram\.com\/[a-z0-9._-]+\/?(\?.*)?$/i.test(value),
    {
      message: "Ingresa un link valido de Instagram",
    },
  );

export const profileGlobalSettingsSchema = z.object({
  websiteUrl: optionalWebsiteUrlField,
  instagramUrl: optionalInstagramUrlField,
});

export type ProfileGlobalSettings = z.infer<typeof profileGlobalSettingsSchema>;
