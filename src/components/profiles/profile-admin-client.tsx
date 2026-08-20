"use client";

import Image from "next/image";
import Link from "next/link";
import { Download, Upload } from "iconoir-react";
import { startTransition, useRef, useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { type CatalogSettings } from "@/lib/catalog-schema";
import {
  type Branch,
  profileGlobalSettingsSchema,
  type ProfileGlobalSettings,
} from "@/lib/profile-global-settings-schema";
import { getPublicProfileUrl } from "@/lib/public-url";
import {
  createProfileSchema,
  profileRoleSchema,
  type CreateProfileInput,
  type Profile,
  type UpdateProfileInput,
  updateProfileSchema,
} from "@/lib/profile-schema";

type ProfileAdminClientProps = {
  initialProfiles: Profile[];
  initialCatalog: CatalogSettings;
  initialGlobalSettings: ProfileGlobalSettings;
};

type FieldErrors = Partial<
  Record<
    | "name"
    | "jobTitle"
    | "branchId"
    | "email"
    | "whatsapp"
    | "rol",
    string[]
  >
>;

type ApiErrorResponse = {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

type ChangePasswordValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type FormValues = {
  name: string;
  jobTitle: string;
  branchId: string;
  email: string;
  whatsapp: string;
  rol: Profile["rol"];
  isActive: boolean;
};

type GlobalSettingsValues = ProfileGlobalSettings;

const roleLabels: Record<Profile["rol"], string> = {
  general: "General",
  vendedor: "Vendedor",
  administracion: "Administracion",
};

const emptyValues: FormValues = {
  name: "",
  jobTitle: "",
  branchId: "",
  email: "",
  whatsapp: "",
  rol: "general",
  isActive: true,
};

const emptyPasswordValues: ChangePasswordValues = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

function getProfileInitials(name: string) {
  const parts = name
    .split(" ")
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 2);

  if (parts.length === 0) {
    return "NF";
  }

  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
}

function getProfilePhotoSrc(profilePhotoUrl: string, updatedAt: string) {
  if (!profilePhotoUrl) {
    return "";
  }

  const separator = profilePhotoUrl.includes("?") ? "&" : "?";

  return `${profilePhotoUrl}${separator}v=${encodeURIComponent(updatedAt)}`;
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Ocurrio un error inesperado.";
}

function ProfileModal({
  mode,
  open,
  values,
  branches,
  errors,
  submitting,
  photoSubmitting,
  photoError,
  submitError,
  profilePhotoUrl,
  updatedAt,
  onChange,
  onOpenPhotoUpload,
  onRemovePhoto,
  onClose,
  onSubmit,
}: {
  mode: "create" | "edit";
  open: boolean;
  values: FormValues;
  branches: Branch[];
  errors: FieldErrors;
  submitting: boolean;
  photoSubmitting: boolean;
  photoError: string | null;
  submitError: string | null;
  profilePhotoUrl?: string;
  updatedAt?: string;
  onChange: (field: keyof FormValues, value: string | boolean) => void;
  onOpenPhotoUpload: () => void;
  onRemovePhoto: () => void;
  onClose: () => void;
  onSubmit: () => void;
}) {
  if (!open) {
    return null;
  }

  const modalBusy = submitting || photoSubmitting;
  const initials = getProfileInitials(values.name);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-0 sm:p-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-modal-title"
        className="mt-auto w-full rounded-t-3xl border border-border bg-background p-5 shadow-2xl sm:mx-auto sm:my-auto sm:max-w-4xl sm:rounded-3xl sm:p-6"
      >
        <div className="flex max-h-[100dvh] flex-col sm:max-h-[calc(100dvh-3rem)]">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {mode === "create" ? "Nuevo perfil" : "Editar perfil"}
              </p>
              <h2 id="profile-modal-title" className="text-xl font-semibold">
                {mode === "create"
                  ? "Crear perfil NFC"
                  : "Actualizar perfil existente"}
              </h2>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onClose}
              disabled={modalBusy}
            >
              <span className="sr-only">Cerrar modal</span>x
            </Button>
          </div>

          <form
            className="space-y-5 overflow-y-auto pr-1"
            onSubmit={(event) => {
              event.preventDefault();
              onSubmit();
            }}
          >
            <div className="rounded-3xl border border-border bg-card p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  {profilePhotoUrl ? (
                    <div className="h-20 w-20 overflow-hidden rounded-2xl border border-border bg-muted">
                      <Image
                        src={getProfilePhotoSrc(profilePhotoUrl, updatedAt ?? "")}
                        alt={`Foto de perfil de ${values.name || "este perfil"}`}
                        width={160}
                        height={160}
                        unoptimized
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-muted text-2xl font-semibold tracking-[-0.08em]">
                      {initials}
                    </div>
                  )}

                  <div className="space-y-1">
                    <p className="text-sm font-medium">Foto de perfil</p>
                    <p className="text-xs text-muted-foreground">
                      JPG, PNG o WebP de hasta 1 MB.
                    </p>
                    {mode === "create" ? (
                      <p className="text-xs text-muted-foreground">
                        Crea el perfil primero para poder subir la foto.
                      </p>
                    ) : null}
                  </div>
                </div>

                {mode === "edit" ? (
                  <div className="flex flex-col gap-2 sm:items-end">
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Button
                        variant="outline"
                        type="button"
                        onClick={onOpenPhotoUpload}
                        disabled={modalBusy}
                      >
                        {photoSubmitting
                          ? "Subiendo..."
                          : profilePhotoUrl
                            ? "Reemplazar foto"
                            : "Subir foto"}
                      </Button>
                      <Button
                        variant="outline"
                        type="button"
                        onClick={onRemovePhoto}
                        disabled={modalBusy || !profilePhotoUrl}
                      >
                        Quitar foto
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>

              {photoError ? (
                <div className="mt-4 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {photoError}
                </div>
              ) : null}
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <div className="space-y-1.5">
                <label htmlFor="profile-name" className="text-sm font-medium">
                  Nombre
                </label>
                <input
                  id="profile-name"
                  value={values.name}
                  onChange={(event) => onChange("name", event.target.value)}
                  className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-ring focus:ring-4 focus:ring-ring/20"
                  placeholder="Franco Sanchez"
                  autoComplete="name"
                />
                {errors.name?.[0] ? (
                  <p className="text-sm text-destructive">{errors.name[0]}</p>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="profile-role" className="text-sm font-medium">
                  Rol
                </label>
                <select
                  id="profile-role"
                  value={values.rol}
                  onChange={(event) => onChange("rol", event.target.value)}
                  className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-ring focus:ring-4 focus:ring-ring/20"
                >
                  {profileRoleSchema.options.map((role) => (
                    <option key={role} value={role}>
                      {roleLabels[role]}
                    </option>
                  ))}
                </select>
                {errors.rol?.[0] ? (
                  <p className="text-sm text-destructive">{errors.rol[0]}</p>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="profile-job-title" className="text-sm font-medium">
                  Puesto de trabajo
                </label>
                <input
                  id="profile-job-title"
                  value={values.jobTitle}
                  onChange={(event) => onChange("jobTitle", event.target.value)}
                  className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-ring focus:ring-4 focus:ring-ring/20"
                  placeholder="Creative Director"
                  autoComplete="organization-title"
                />
                {errors.jobTitle?.[0] ? (
                  <p className="text-sm text-destructive">{errors.jobTitle[0]}</p>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="profile-branch" className="text-sm font-medium">
                  Sucursal
                </label>
                <select
                  id="profile-branch"
                  value={values.branchId}
                  onChange={(event) => onChange("branchId", event.target.value)}
                  className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-ring focus:ring-4 focus:ring-ring/20"
                >
                  <option value="">Sin sucursal asignada</option>
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground">
                  Cada perfil puede tener una sola sucursal. La direccion publica
                  se resuelve desde esta asignacion.
                </p>
                {errors.branchId?.[0] ? (
                  <p className="text-sm text-destructive">{errors.branchId[0]}</p>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="profile-email" className="text-sm font-medium">
                  Email
                </label>
                <input
                  id="profile-email"
                  type="email"
                  value={values.email}
                  onChange={(event) => onChange("email", event.target.value)}
                  className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-ring focus:ring-4 focus:ring-ring/20"
                  placeholder="fsanchez@gmail.com"
                  autoComplete="email"
                />
                {errors.email?.[0] ? (
                  <p className="text-sm text-destructive">{errors.email[0]}</p>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="profile-whatsapp" className="text-sm font-medium">
                  WhatsApp
                </label>
                <input
                  id="profile-whatsapp"
                  inputMode="numeric"
                  value={values.whatsapp}
                  onChange={(event) => onChange("whatsapp", event.target.value)}
                  className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-ring focus:ring-4 focus:ring-ring/20"
                  placeholder="1123456789"
                  autoComplete="tel"
                />
                <p className="text-xs text-muted-foreground">
                  Opcional. Si lo completas, ingresa solo codigo de area y numero.
                </p>
                {errors.whatsapp?.[0] ? (
                  <p className="text-sm text-destructive">{errors.whatsapp[0]}</p>
                ) : null}
              </div>
            </div>

            {submitError ? (
              <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {submitError}
              </div>
            ) : null}

            <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                type="button"
                onClick={onClose}
                disabled={modalBusy}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={modalBusy}>
                {submitting
                  ? "Guardando..."
                  : mode === "create"
                    ? "Crear perfil"
                    : "Guardar cambios"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function ChangePasswordModal({
  open,
  values,
  submitting,
  submitError,
  onChange,
  onClose,
  onSubmit,
}: {
  open: boolean;
  values: ChangePasswordValues;
  submitting: boolean;
  submitError: string | null;
  onChange: (field: keyof ChangePasswordValues, value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-0 sm:p-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="password-modal-title"
        className="mt-auto w-full rounded-t-3xl border border-border bg-background p-5 shadow-2xl sm:mx-auto sm:my-auto sm:max-w-lg sm:rounded-3xl sm:p-6"
      >
        <div className="flex max-h-[100dvh] flex-col sm:max-h-[calc(100dvh-3rem)]">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Seguridad
              </p>
              <h2 id="password-modal-title" className="text-xl font-semibold">
                Cambiar contrasena
              </h2>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onClose}
              disabled={submitting}
            >
              <span className="sr-only">Cerrar modal</span>x
            </Button>
          </div>

          <form
            className="space-y-4 overflow-y-auto pr-1"
            onSubmit={(event) => {
              event.preventDefault();
              onSubmit();
            }}
          >
            <div className="space-y-1.5">
              <label htmlFor="current-password" className="text-sm font-medium">
                Contrasena actual
              </label>
              <input
                id="current-password"
                type="password"
                value={values.currentPassword}
                onChange={(event) =>
                  onChange("currentPassword", event.target.value)
                }
                className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-ring focus:ring-4 focus:ring-ring/20"
                autoComplete="current-password"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="new-password" className="text-sm font-medium">
                Nueva contrasena
              </label>
              <input
                id="new-password"
                type="password"
                value={values.newPassword}
                onChange={(event) => onChange("newPassword", event.target.value)}
                className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-ring focus:ring-4 focus:ring-ring/20"
                autoComplete="new-password"
              />
              <p className="text-xs text-muted-foreground">
                Debe tener al menos 8 caracteres.
              </p>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="confirm-password" className="text-sm font-medium">
                Confirmar nueva contrasena
              </label>
              <input
                id="confirm-password"
                type="password"
                value={values.confirmPassword}
                onChange={(event) =>
                  onChange("confirmPassword", event.target.value)
                }
                className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-ring focus:ring-4 focus:ring-ring/20"
                autoComplete="new-password"
              />
            </div>

            {submitError ? (
              <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {submitError}
              </div>
            ) : null}

            <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                type="button"
                onClick={onClose}
                disabled={submitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Actualizando..." : "Guardar contrasena"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function GlobalSettingsModal({
  open,
  values,
  errors,
  branchUsage,
  submitting,
  submitError,
  onChange,
  onBranchChange,
  onAddBranch,
  onRemoveBranch,
  onClose,
  onSubmit,
}: {
  open: boolean;
  values: GlobalSettingsValues;
  errors: Partial<Record<keyof GlobalSettingsValues, string[]>>;
  branchUsage: Record<string, number>;
  submitting: boolean;
  submitError: string | null;
  onChange: (field: keyof GlobalSettingsValues, value: string) => void;
  onBranchChange: (branchId: string, field: keyof Branch, value: string) => void;
  onAddBranch: () => void;
  onRemoveBranch: (branchId: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-0 sm:p-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="global-settings-modal-title"
        className="mt-auto w-full rounded-t-3xl border border-border bg-background p-5 shadow-2xl sm:mx-auto sm:my-auto sm:max-w-2xl sm:rounded-3xl sm:p-6"
      >
        <div className="flex max-h-[100dvh] flex-col sm:max-h-[calc(100dvh-3rem)]">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Configuracion compartida
              </p>
              <h2
                id="global-settings-modal-title"
                className="text-xl font-semibold"
              >
                Configuraciones globales
              </h2>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onClose}
              disabled={submitting}
            >
              <span className="sr-only">Cerrar modal</span>x
            </Button>
          </div>

          <form
            className="space-y-5 overflow-y-auto pr-1"
            onSubmit={(event) => {
              event.preventDefault();
              onSubmit();
            }}
          >
            <div className="rounded-3xl border border-border bg-card p-4 text-sm text-muted-foreground">
              El sitio web, Instagram y las sucursales se comparten en todas las
              landings publicas. Cada perfil puede quedar asociado a una sola
              sucursal.
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="global-website-url" className="text-sm font-medium">
                  Sitio web global
                </label>
                <input
                  id="global-website-url"
                  type="url"
                  value={values.websiteUrl}
                  onChange={(event) => onChange("websiteUrl", event.target.value)}
                  className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-ring focus:ring-4 focus:ring-ring/20"
                  placeholder="https://..."
                  autoComplete="url"
                />
                {errors.websiteUrl?.[0] ? (
                  <p className="text-sm text-destructive">{errors.websiteUrl[0]}</p>
                ) : null}
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="global-instagram-url"
                  className="text-sm font-medium"
                >
                  Instagram global
                </label>
                <input
                  id="global-instagram-url"
                  type="url"
                  value={values.instagramUrl}
                  onChange={(event) => onChange("instagramUrl", event.target.value)}
                  className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-ring focus:ring-4 focus:ring-ring/20"
                  placeholder="https://instagram.com/..."
                  autoComplete="url"
                />
                {errors.instagramUrl?.[0] ? (
                  <p className="text-sm text-destructive">
                    {errors.instagramUrl[0]}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-base font-semibold">Sucursales</h3>
                  <p className="text-sm text-muted-foreground">
                    Crea y administra las sucursales disponibles para asignar a
                    los perfiles.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onAddBranch}
                  disabled={submitting}
                >
                  Agregar sucursal
                </Button>
              </div>

              <div className="mt-4 space-y-4">
                {values.branches.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border bg-background px-4 py-5 text-sm text-muted-foreground">
                    No hay sucursales cargadas todavia.
                  </div>
                ) : (
                  values.branches.map((branch, index) => {
                    const usageCount = branchUsage[branch.id] ?? 0;

                    return (
                      <div
                        key={branch.id}
                        className="rounded-2xl border border-border bg-background p-4"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                              Sucursal {index + 1}
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {usageCount > 0
                                ? `Asignada a ${usageCount} perfil${usageCount === 1 ? "" : "es"}`
                                : "Sin perfiles asignados"}
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => onRemoveBranch(branch.id)}
                            disabled={submitting || usageCount > 0}
                          >
                            Eliminar
                          </Button>
                        </div>

                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                          <div className="space-y-1.5">
                            <label
                              htmlFor={`branch-name-${branch.id}`}
                              className="text-sm font-medium"
                            >
                              Nombre de sucursal
                            </label>
                            <input
                              id={`branch-name-${branch.id}`}
                              value={branch.name}
                              onChange={(event) =>
                                onBranchChange(branch.id, "name", event.target.value)
                              }
                              className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-ring focus:ring-4 focus:ring-ring/20"
                              placeholder="Casa Central"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label
                              htmlFor={`branch-address-${branch.id}`}
                              className="text-sm font-medium"
                            >
                              Direccion
                            </label>
                            <input
                              id={`branch-address-${branch.id}`}
                              value={branch.address}
                              onChange={(event) =>
                                onBranchChange(
                                  branch.id,
                                  "address",
                                  event.target.value,
                                )
                              }
                              className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-ring focus:ring-4 focus:ring-ring/20"
                              placeholder="Av. Siempre Viva 742"
                            />
                          </div>

                          <div className="space-y-1.5 md:col-span-2">
                            <label
                              htmlFor={`branch-maps-${branch.id}`}
                              className="text-sm font-medium"
                            >
                              Link Google Maps
                            </label>
                            <input
                              id={`branch-maps-${branch.id}`}
                              type="url"
                              value={branch.googleMapsUrl}
                              onChange={(event) =>
                                onBranchChange(
                                  branch.id,
                                  "googleMapsUrl",
                                  event.target.value,
                                )
                              }
                              className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-ring focus:ring-4 focus:ring-ring/20"
                              placeholder="https://maps.google.com/..."
                              autoComplete="url"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}

                {errors.branches?.[0] ? (
                  <p className="text-sm text-destructive">{errors.branches[0]}</p>
                ) : null}
              </div>
            </div>

            {submitError ? (
              <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {submitError}
              </div>
            ) : null}

            <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                type="button"
                onClick={onClose}
                disabled={submitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Guardando..." : "Guardar configuracion"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function CatalogModal({
  open,
  catalog,
  actionError,
  downloading,
  uploading,
  fileInputRef,
  onClose,
  onDownload,
  onOpenUpload,
  onUpload,
}: {
  open: boolean;
  catalog: CatalogSettings;
  actionError: string | null;
  downloading: boolean;
  uploading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onClose: () => void;
  onDownload: () => void;
  onOpenUpload: () => void;
  onUpload: (file: File) => void;
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-0 sm:p-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="catalog-modal-title"
        className="mt-auto w-full rounded-t-3xl border border-border bg-background p-5 shadow-2xl sm:mx-auto sm:my-auto sm:max-w-5xl sm:rounded-3xl sm:p-6"
      >
        <div className="flex max-h-[100dvh] flex-col sm:max-h-[calc(100dvh-3rem)]">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Vendedores
              </p>
              <h2 id="catalog-modal-title" className="text-xl font-semibold">
                Catalogo compartido
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                Solo los perfiles con rol vendedor muestran este catalogo en su
                landing publica.
              </p>
            </div>
            <Button variant="ghost" size="icon-sm" onClick={onClose}>
              <span className="sr-only">Cerrar modal</span>x
            </Button>
          </div>

          <div className="space-y-5 overflow-y-auto pr-1">
            {actionError ? (
              <div className="rounded-3xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {actionError}
              </div>
            ) : null}

            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];

                  if (file) {
                    onUpload(file);
                  }
                }}
              />
              <Button
                variant="outline"
                onClick={onDownload}
                disabled={downloading || uploading}
              >
                <Download className="h-4 w-4" />
                {downloading ? "Descargando..." : "Descargar Excel"}
              </Button>
              <Button
                variant="outline"
                onClick={onOpenUpload}
                disabled={uploading || downloading}
              >
                <Upload className="h-4 w-4" />
                {uploading ? "Subiendo..." : "Subir Excel"}
              </Button>
            </div>

            <div className="space-y-3">
              {catalog.items.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-border bg-background px-4 py-6 text-sm text-muted-foreground">
                  No hay productos cargados todavia.
                </div>
              ) : (
                catalog.items.map((item, index) => (
                  <div
                    key={index}
                    className="grid gap-4 rounded-3xl border border-border bg-background p-4 sm:grid-cols-[168px_minmax(0,1fr)_auto] sm:items-center"
                  >
                    <div className="overflow-hidden rounded-2xl border border-border bg-muted">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        width={580}
                        height={280}
                        unoptimized
                        className="aspect-[29/14] h-auto w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        Producto {index + 1}
                      </p>
                      <p className="truncate text-base font-medium">{item.name}</p>
                    </div>
                    <a
                      href={item.technicalSheetUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-border px-4 text-sm font-medium transition hover:border-foreground hover:bg-muted"
                    >
                      Ver ficha
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProfileAdminClient({
  initialProfiles,
  initialCatalog,
  initialGlobalSettings,
}: ProfileAdminClientProps) {
  const [profiles, setProfiles] = useState(initialProfiles);
  const [catalog, setCatalog] = useState(initialCatalog);
  const [globalSettings, setGlobalSettings] = useState(initialGlobalSettings);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [formValues, setFormValues] = useState<FormValues>(emptyValues);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [listBusyId, setListBusyId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordValues, setPasswordValues] =
    useState<ChangePasswordValues>(emptyPasswordValues);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [catalogActionError, setCatalogActionError] = useState<string | null>(null);
  const [catalogDownloading, setCatalogDownloading] = useState(false);
  const [catalogUploading, setCatalogUploading] = useState(false);
  const [catalogModalOpen, setCatalogModalOpen] = useState(false);
  const [globalSettingsModalOpen, setGlobalSettingsModalOpen] = useState(false);
  const [globalSettingsValues, setGlobalSettingsValues] =
    useState<GlobalSettingsValues>(initialGlobalSettings);
  const [globalSettingsErrors, setGlobalSettingsErrors] = useState<
    Partial<Record<keyof GlobalSettingsValues, string[]>>
  >({});
  const [globalSettingsSubmitting, setGlobalSettingsSubmitting] = useState(false);
  const [globalSettingsError, setGlobalSettingsError] = useState<string | null>(null);
  const [photoSubmitting, setPhotoSubmitting] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const catalogFileInputRef = useRef<HTMLInputElement | null>(null);
  const photoFileInputRef = useRef<HTMLInputElement | null>(null);
  const branchUsage = profiles.reduce<Record<string, number>>((counts, profile) => {
    if (profile.branchId) {
      counts[profile.branchId] = (counts[profile.branchId] ?? 0) + 1;
    }

    return counts;
  }, {});

  function openCreateModal() {
    setModalMode("create");
    setSelectedProfile(null);
    setFormValues(emptyValues);
    setFieldErrors({});
    setSubmitError(null);
    setPhotoError(null);
    setModalOpen(true);
  }

  function openEditModal(profile: Profile) {
    setModalMode("edit");
    setSelectedProfile(profile);
    setFormValues({
      name: profile.name,
      jobTitle: profile.jobTitle,
      branchId: profile.branchId,
      email: profile.email,
      whatsapp: profile.whatsapp,
      rol: profile.rol,
      isActive: profile.isActive,
    });
    setFieldErrors({});
    setSubmitError(null);
    setPhotoError(null);
    setModalOpen(true);
  }

  function closeModal() {
    if (submitting || photoSubmitting) {
      return;
    }

    setModalOpen(false);
    setFieldErrors({});
    setSubmitError(null);
    setPhotoError(null);
  }

  function openPasswordModal() {
    setPasswordValues(emptyPasswordValues);
    setPasswordError(null);
    setPasswordModalOpen(true);
  }

  function closePasswordModal() {
    if (passwordSubmitting) {
      return;
    }

    setPasswordModalOpen(false);
    setPasswordError(null);
  }

  function openCatalogModal() {
    setCatalogModalOpen(true);
  }

  function closeCatalogModal() {
    setCatalogModalOpen(false);
  }

  function openGlobalSettingsModal() {
    setGlobalSettingsValues(globalSettings);
    setGlobalSettingsErrors({});
    setGlobalSettingsError(null);
    setGlobalSettingsModalOpen(true);
  }

  function closeGlobalSettingsModal() {
    if (globalSettingsSubmitting) {
      return;
    }

    setGlobalSettingsModalOpen(false);
    setGlobalSettingsErrors({});
    setGlobalSettingsError(null);
  }

  function updateFormValue(field: keyof FormValues, value: string | boolean) {
    setFormValues((current) => ({ ...current, [field]: value }));
  }

  function updateGlobalSettingsValue(
    field: keyof GlobalSettingsValues,
    value: string,
  ) {
    setGlobalSettingsValues((current) => ({ ...current, [field]: value }));
  }

  function updateBranchValue(
    branchId: string,
    field: keyof Branch,
    value: string,
  ) {
    setGlobalSettingsValues((current) => ({
      ...current,
      branches: current.branches.map((branch) =>
        branch.id === branchId ? { ...branch, [field]: value } : branch,
      ),
    }));
  }

  function addBranch() {
    setGlobalSettingsValues((current) => ({
      ...current,
      branches: [
        ...current.branches,
        {
          id: crypto.randomUUID(),
          name: "",
          address: "",
          googleMapsUrl: "",
        },
      ],
    }));
  }

  function removeBranch(branchId: string) {
    setGlobalSettingsValues((current) => ({
      ...current,
      branches: current.branches.filter((branch) => branch.id !== branchId),
    }));
  }

  function updatePasswordValue(
    field: keyof ChangePasswordValues,
    value: string,
  ) {
    setPasswordValues((current) => ({ ...current, [field]: value }));
  }

  function syncProfiles(nextProfiles: Profile[]) {
    startTransition(() => {
      setProfiles(nextProfiles);
    });
  }

  function syncCatalog(nextCatalog: CatalogSettings) {
    startTransition(() => {
      setCatalog(nextCatalog);
    });
  }

  function syncGlobalSettings(nextSettings: GlobalSettingsValues) {
    startTransition(() => {
      setGlobalSettings(nextSettings);
    });
  }

  function openCatalogUpload() {
    if (catalogUploading) {
      return;
    }

    catalogFileInputRef.current?.click();
  }

  function openPhotoUpload() {
    if (modalMode !== "edit" || !selectedProfile || photoSubmitting) {
      return;
    }

    photoFileInputRef.current?.click();
  }

  async function refreshProfiles() {
    const response = await fetch("/api/profiles", { cache: "no-store" });
    const data = (await response.json()) as { profiles?: Profile[] } & ApiErrorResponse;

    if (!response.ok || !data.profiles) {
      throw new Error(data.error ?? "No se pudo actualizar la tabla.");
    }

    syncProfiles(data.profiles);
  }

  async function submitProfile() {
    setFieldErrors({});
    setSubmitError(null);
    setSuccessMessage(null);

    const payload =
      modalMode === "create"
        ? ({
            name: formValues.name,
            jobTitle: formValues.jobTitle,
            branchId: formValues.branchId,
            email: formValues.email,
            whatsapp: formValues.whatsapp,
            rol: formValues.rol,
          } satisfies CreateProfileInput)
        : ({
            name: formValues.name,
            jobTitle: formValues.jobTitle,
            branchId: formValues.branchId,
            email: formValues.email,
            whatsapp: formValues.whatsapp,
            rol: formValues.rol,
            isActive: formValues.isActive,
          } satisfies UpdateProfileInput);

    const validation =
      modalMode === "create"
        ? createProfileSchema.safeParse(payload)
        : updateProfileSchema.safeParse(payload);

    if (!validation.success) {
      setFieldErrors(validation.error.flatten().fieldErrors);
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        modalMode === "create"
          ? "/api/profiles"
          : `/api/profiles/${selectedProfile?.id ?? ""}`,
        {
          method: modalMode === "create" ? "POST" : "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(validation.data),
        },
      );

      const data = (await response.json()) as ApiErrorResponse & {
        profile?: Profile;
      };

      if (!response.ok) {
        setFieldErrors((data.fieldErrors ?? {}) as FieldErrors);
        setSubmitError(data.error ?? "No se pudo guardar el perfil.");
        return;
      }

      await refreshProfiles();

      if ("profile" in data && data.profile) {
        setSuccessMessage(
          modalMode === "create"
            ? `Perfil creado. URL publica lista: /credenciales/${data.profile.slug}`
            : `Perfil actualizado. URL publica: /credenciales/${data.profile.slug}`,
        );
      }

      setModalOpen(false);
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleActive(profile: Profile, isActive: boolean) {
    setListBusyId(profile.id);
    setSubmitError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(`/api/profiles/${profile.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: profile.name,
          jobTitle: profile.jobTitle,
          branchId: profile.branchId,
          email: profile.email,
          whatsapp: profile.whatsapp,
          rol: profile.rol,
          isActive,
        } satisfies UpdateProfileInput),
      });

      const data = (await response.json()) as ApiErrorResponse;

      if (!response.ok) {
        throw new Error(data.error ?? "No se pudo actualizar el estado.");
      }

      await refreshProfiles();
      setSuccessMessage(
        isActive
          ? `Perfil reactivado: /credenciales/${profile.slug}`
          : `Perfil desactivado: /credenciales/${profile.slug}`,
      );
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    } finally {
      setListBusyId(null);
    }
  }

  async function downloadCatalogExcel() {
    setCatalogActionError(null);
    setSuccessMessage(null);
    setCatalogDownloading(true);

    try {
      const response = await fetch("/api/catalog/excel", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;

        throw new Error(data?.error ?? "No se pudo descargar el catalogo.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "catalogo-vendedores.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setCatalogActionError(getErrorMessage(error));
    } finally {
      setCatalogDownloading(false);
    }
  }

  async function uploadCatalogExcel(file: File) {
    setCatalogActionError(null);
    setSuccessMessage(null);
    setCatalogUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/catalog/excel", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as ApiErrorResponse & {
        catalog?: CatalogSettings;
      };

      if (!response.ok || !data.catalog) {
        throw new Error(data.error ?? "No se pudo importar el catalogo.");
      }

      syncCatalog(data.catalog);
      setSuccessMessage("Catalogo actualizado desde Excel.");
    } catch (error) {
      setCatalogActionError(getErrorMessage(error));
    } finally {
      setCatalogUploading(false);

      if (catalogFileInputRef.current) {
        catalogFileInputRef.current.value = "";
      }
    }
  }

  async function uploadProfilePhoto(file: File) {
    if (!selectedProfile) {
      return;
    }

    setPhotoError(null);
    setSubmitError(null);
    setSuccessMessage(null);
    setPhotoSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`/api/profiles/${selectedProfile.id}/photo`, {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as ApiErrorResponse & {
        profile?: Profile;
      };

      if (!response.ok || !data.profile) {
        throw new Error(data.error ?? "No se pudo subir la foto del perfil.");
      }

      await refreshProfiles();
      setSelectedProfile(data.profile);
      setSuccessMessage("Foto de perfil actualizada.");
    } catch (error) {
      setPhotoError(getErrorMessage(error));
    } finally {
      setPhotoSubmitting(false);

      if (photoFileInputRef.current) {
        photoFileInputRef.current.value = "";
      }
    }
  }

  async function removeProfilePhoto() {
    if (!selectedProfile || !selectedProfile.profilePhotoUrl) {
      return;
    }

    setPhotoError(null);
    setSubmitError(null);
    setSuccessMessage(null);
    setPhotoSubmitting(true);

    try {
      const response = await fetch(`/api/profiles/${selectedProfile.id}/photo`, {
        method: "DELETE",
      });

      const data = (await response.json()) as ApiErrorResponse & {
        profile?: Profile;
      };

      if (!response.ok || !data.profile) {
        throw new Error(data.error ?? "No se pudo eliminar la foto del perfil.");
      }

      await refreshProfiles();
      setSelectedProfile(data.profile);
      setSuccessMessage("Foto de perfil eliminada.");
    } catch (error) {
      setPhotoError(getErrorMessage(error));
    } finally {
      setPhotoSubmitting(false);
    }
  }

  async function submitGlobalSettings() {
    setGlobalSettingsErrors({});
    setGlobalSettingsError(null);
    setSuccessMessage(null);

    const validation = profileGlobalSettingsSchema.safeParse(globalSettingsValues);

    if (!validation.success) {
      setGlobalSettingsErrors(validation.error.flatten().fieldErrors);
      return;
    }

    setGlobalSettingsSubmitting(true);

    try {
      const response = await fetch("/api/profile-global-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validation.data),
      });

      const data = (await response.json()) as ApiErrorResponse & {
        settings?: GlobalSettingsValues;
      };

      if (!response.ok || !data.settings) {
        setGlobalSettingsErrors(
          (data.fieldErrors ?? {}) as Partial<Record<keyof GlobalSettingsValues, string[]>>
        );
        setGlobalSettingsError(
          data.error ?? "No se pudieron guardar las configuraciones globales.",
        );
        return;
      }

      syncGlobalSettings(data.settings);
      setGlobalSettingsValues(data.settings);
      setGlobalSettingsModalOpen(false);
      setSuccessMessage("Configuraciones globales actualizadas.");
    } catch (error) {
      setGlobalSettingsError(getErrorMessage(error));
    } finally {
      setGlobalSettingsSubmitting(false);
    }
  }

  async function submitPasswordChange() {
    setPasswordError(null);
    setSuccessMessage(null);

    if (!passwordValues.currentPassword || !passwordValues.newPassword) {
      setPasswordError("Completa la contrasena actual y la nueva.");
      return;
    }

    if (passwordValues.newPassword.length < 8) {
      setPasswordError("La nueva contrasena debe tener al menos 8 caracteres.");
      return;
    }

    if (passwordValues.newPassword !== passwordValues.confirmPassword) {
      setPasswordError("La confirmacion no coincide con la nueva contrasena.");
      return;
    }

    setPasswordSubmitting(true);

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          currentPassword: passwordValues.currentPassword,
          newPassword: passwordValues.newPassword,
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as
          | { message?: string; code?: string }
          | null;

        if (data?.code === "INVALID_PASSWORD") {
          setPasswordError("La contrasena actual no es correcta.");
        } else if (data?.code === "PASSWORD_TOO_SHORT") {
          setPasswordError("La nueva contrasena debe tener al menos 8 caracteres.");
        } else if (data?.message) {
          setPasswordError(data.message);
        } else {
          setPasswordError("No se pudo actualizar la contrasena.");
        }

        return;
      }

      setPasswordModalOpen(false);
      setPasswordValues(emptyPasswordValues);
      setSuccessMessage("Contrasena actualizada correctamente.");
    } catch (error) {
      setPasswordError(getErrorMessage(error));
    } finally {
      setPasswordSubmitting(false);
    }
  }

  return (
    <div className="flex w-full flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Gestion interna
          </p>
          <div>
            <h1 className="text-2xl font-semibold sm:text-3xl">Perfiles NFC</h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground sm:text-base">
              Administra perfiles, define su rol, asigna sucursales y controla
              las configuraciones globales compartidas.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            ref={photoFileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];

              if (file) {
                void uploadProfilePhoto(file);
              }
            }}
          />
          <Link
            href="/credenciales/perfiles/metricas"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            Ver metricas
          </Link>
          <Button variant="outline" size="lg" onClick={openCatalogModal}>
            Ver catalogo
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={openGlobalSettingsModal}
          >
            Config globales
          </Button>
          <Button variant="outline" size="lg" onClick={openPasswordModal}>
            Cambiar contrasena
          </Button>
          <Button size="lg" onClick={openCreateModal}>
            Crear perfil
          </Button>
        </div>
      </header>

      {successMessage ? (
        <div className="rounded-3xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-foreground">
          {successMessage}
        </div>
      ) : null}

      {submitError && !modalOpen ? (
        <div className="rounded-3xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {submitError}
        </div>
      ) : null}

      {catalogActionError ? (
        <div className="rounded-3xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {catalogActionError}
        </div>
      ) : null}

      <section className="overflow-hidden rounded-3xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-muted/60 text-xs uppercase tracking-[0.16em] text-muted-foreground">
              <tr>
                <th className="px-4 py-4 font-medium">Perfil</th>
                <th className="px-4 py-4 font-medium">Rol</th>
                <th className="px-4 py-4 font-medium">Sucursal</th>
                <th className="px-4 py-4 font-medium">Slug</th>
                <th className="px-4 py-4 font-medium">Link del tag</th>
                <th className="px-4 py-4 font-medium">Estado</th>
                <th className="px-4 py-4 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {profiles.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center text-sm text-muted-foreground"
                  >
                    Todavia no hay perfiles cargados.
                  </td>
                </tr>
              ) : null}

              {profiles.map((profile) => {
                const busy = listBusyId === profile.id;
                const publicUrl = getPublicProfileUrl(profile.slug);
                const branchName =
                  globalSettings.branches.find((branch) => branch.id === profile.branchId)
                    ?.name ?? "Sin sucursal";

                return (
                  <tr key={profile.id} className="border-t border-border align-top">
                    <td className="px-4 py-4">
                      <p className="font-medium">{profile.name}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex rounded-full border border-border bg-background px-3 py-1 text-xs font-medium">
                        {roleLabels[profile.rol]}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-muted-foreground">{branchName}</span>
                    </td>
                    <td className="px-4 py-4">
                      <Link
                        href={`/credenciales/${profile.slug}`}
                        target="_blank"
                        className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                      >
                        /credenciales/{profile.slug}
                      </Link>
                    </td>
                    <td className="px-4 py-4">
                      <a
                        href={publicUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="block max-w-[14rem] truncate text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                        title={publicUrl}
                      >
                        {publicUrl}
                      </a>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={
                          profile.isActive
                            ? "inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-foreground"
                            : "inline-flex rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                        }
                      >
                        {profile.isActive ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="inline-flex items-center overflow-hidden rounded-2xl border border-border">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(profile)}
                          disabled={busy}
                          className="rounded-none border-r border-border"
                        >
                          Editar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleActive(profile, !profile.isActive)}
                          disabled={busy}
                          className="rounded-none"
                        >
                          {busy
                            ? "Procesando..."
                            : profile.isActive
                              ? "Desactivar"
                              : "Activar"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <ProfileModal
        mode={modalMode}
        open={modalOpen}
        values={formValues}
        branches={globalSettings.branches}
        errors={fieldErrors}
        submitting={submitting}
        photoSubmitting={photoSubmitting}
        photoError={photoError}
        submitError={submitError}
        profilePhotoUrl={selectedProfile?.profilePhotoUrl}
        updatedAt={selectedProfile?.updatedAt}
        onChange={updateFormValue}
        onOpenPhotoUpload={openPhotoUpload}
        onRemovePhoto={removeProfilePhoto}
        onClose={closeModal}
        onSubmit={submitProfile}
      />
      <ChangePasswordModal
        open={passwordModalOpen}
        values={passwordValues}
        submitting={passwordSubmitting}
        submitError={passwordError}
        onChange={updatePasswordValue}
        onClose={closePasswordModal}
        onSubmit={submitPasswordChange}
      />
      <GlobalSettingsModal
        open={globalSettingsModalOpen}
        values={globalSettingsValues}
        errors={globalSettingsErrors}
        branchUsage={branchUsage}
        submitting={globalSettingsSubmitting}
        submitError={globalSettingsError}
        onChange={updateGlobalSettingsValue}
        onBranchChange={updateBranchValue}
        onAddBranch={addBranch}
        onRemoveBranch={removeBranch}
        onClose={closeGlobalSettingsModal}
        onSubmit={submitGlobalSettings}
      />
      <CatalogModal
        open={catalogModalOpen}
        catalog={catalog}
        actionError={catalogActionError}
        downloading={catalogDownloading}
        uploading={catalogUploading}
        fileInputRef={catalogFileInputRef}
        onClose={closeCatalogModal}
        onDownload={() => {
          void downloadCatalogExcel();
        }}
        onOpenUpload={openCatalogUpload}
        onUpload={(file) => {
          void uploadCatalogExcel(file);
        }}
      />
    </div>
  );
}
