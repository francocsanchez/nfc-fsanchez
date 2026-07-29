import { z } from "zod";

const requiredUrlField = z
  .string()
  .trim()
  .min(1, "El link es obligatorio")
  .url("Ingresa un link valido")
  .refine((value) => /^https?:\/\//i.test(value), {
    message: "Ingresa un link HTTP o HTTPS valido",
  });

export const catalogItemSchema = z.object({
  imageUrl: requiredUrlField,
  name: z.string().trim().min(1, "El nombre es obligatorio").max(160),
  technicalSheetUrl: requiredUrlField,
});

export const catalogSettingsSchema = z.object({
  items: z.array(catalogItemSchema),
});

export type CatalogItem = z.infer<typeof catalogItemSchema>;
export type CatalogSettings = z.infer<typeof catalogSettingsSchema>;
