import { z } from "zod";

function optionalTextField(max: number) {
  return z
    .string()
    .trim()
    .max(max)
    .optional()
    .or(z.literal(""))
    .transform((value) => value ?? "");
}

const optionalUrlField = z
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

const whatsappSchema = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
  .transform((value) => value ?? "")
  .refine((value) => value === "" || /^\d+$/.test(value), {
    message: "Ingresa solo numeros, sin espacios ni simbolos",
  })
  .refine((value) => value === "" || value.length >= 10, {
    message: "Ingresa un numero valido",
  })
  .refine((value) => value === "" || value.length <= 11, {
    message: "Ingresa un numero valido",
  })
  .refine((value) => value === "" || !value.startsWith("549"), {
    message: "No ingreses +549 ni 549. Solo codigo de area y numero.",
  });

export const createProfileSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio").max(120),
  jobTitle: optionalTextField(120),
  address: optionalTextField(160),
  googleMapsUrl: optionalUrlField,
  email: z.string().trim().email("Ingresa un email valido").max(160),
  whatsapp: whatsappSchema,
});

export const updateProfileSchema = createProfileSchema.extend({
  isActive: z.boolean(),
});

export type CreateProfileInput = z.infer<typeof createProfileSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export type Profile = {
  id: string;
  name: string;
  jobTitle: string;
  address: string;
  googleMapsUrl: string;
  email: string;
  whatsapp: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
