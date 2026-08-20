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

const optionalGoogleMapsUrlField = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
  .transform((value) => value ?? "")
  .refine(
    (value) =>
      value === "" ||
      /^https?:\/\/(www\.)?(google\.[^/]+|maps\.app\.goo\.gl)\//i.test(value),
    {
      message: "Ingresa un link valido de Google Maps",
    },
  );

export const branchSchema = z.object({
  id: z.string().trim().min(1, "La sucursal es obligatoria"),
  name: z.string().trim().min(1, "El nombre es obligatorio").max(120),
  address: z.string().trim().min(1, "La direccion es obligatoria").max(160),
  googleMapsUrl: optionalGoogleMapsUrlField,
});

export const profileGlobalSettingsSchema = z.object({
  websiteUrl: optionalWebsiteUrlField,
  instagramUrl: optionalInstagramUrlField,
  branches: z.array(branchSchema),
});

export type Branch = z.infer<typeof branchSchema>;
export type ProfileGlobalSettings = z.infer<typeof profileGlobalSettingsSchema>;
