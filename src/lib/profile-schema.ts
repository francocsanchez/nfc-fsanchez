import { z } from "zod";

export const profileRoleSchema = z.enum([
  "general",
  "vendedor",
  "administracion",
]);

function optionalTextField(max: number) {
  return z
    .string()
    .trim()
    .max(max)
    .optional()
    .or(z.literal(""))
    .transform((value) => value ?? "");
}

const optionalBranchIdField = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
  .transform((value) => value ?? "");

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
  branchId: optionalBranchIdField,
  email: z.string().trim().email("Ingresa un email valido").max(160),
  whatsapp: whatsappSchema,
  rol: profileRoleSchema.default("general"),
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
  branchId: string;
  email: string;
  whatsapp: string;
  profilePhotoUrl: string;
  rol: z.infer<typeof profileRoleSchema>;
  slug: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
