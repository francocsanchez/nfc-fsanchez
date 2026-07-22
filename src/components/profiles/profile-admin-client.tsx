"use client";

import Link from "next/link";
import { startTransition, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  createProfileSchema,
  type CreateProfileInput,
  type Profile,
  type UpdateProfileInput,
  updateProfileSchema,
} from "@/lib/profile-schema";
import { getPublicProfileUrl } from "@/lib/public-url";

type ProfileAdminClientProps = {
  initialProfiles: Profile[];
};

type FieldErrors = Partial<
  Record<
    "name" | "jobTitle" | "address" | "googleMapsUrl" | "email" | "whatsapp",
    string[]
  >
>;

type ApiErrorResponse = {
  error?: string;
  fieldErrors?: FieldErrors;
};

type FormValues = {
  name: string;
  jobTitle: string;
  address: string;
  googleMapsUrl: string;
  email: string;
  whatsapp: string;
  isActive: boolean;
};

const emptyValues: FormValues = {
  name: "",
  jobTitle: "",
  address: "",
  googleMapsUrl: "",
  email: "",
  whatsapp: "",
  isActive: true,
};

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
  errors,
  submitting,
  submitError,
  slug,
  publicUrl,
  onChange,
  onClose,
  onSubmit,
}: {
  mode: "create" | "edit";
  open: boolean;
  values: FormValues;
  errors: FieldErrors;
  submitting: boolean;
  submitError: string | null;
  slug?: string;
  publicUrl?: string;
  onChange: (field: keyof FormValues, value: string | boolean) => void;
  onClose: () => void;
  onSubmit: () => void;
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/50 p-0 sm:items-center sm:justify-center sm:p-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-modal-title"
        className="w-full rounded-t-3xl border border-border bg-background p-5 shadow-2xl sm:max-w-4xl sm:rounded-3xl sm:p-6"
      >
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
            disabled={submitting}
          >
            <span className="sr-only">Cerrar modal</span>x
          </Button>
        </div>

        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
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
              <label htmlFor="profile-address" className="text-sm font-medium">
                Direccion
              </label>
              <input
                id="profile-address"
                value={values.address}
                onChange={(event) => onChange("address", event.target.value)}
                className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-ring focus:ring-4 focus:ring-ring/20"
                placeholder="Buenos Aires, Argentina"
                autoComplete="street-address"
              />
              {errors.address?.[0] ? (
                <p className="text-sm text-destructive">{errors.address[0]}</p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="profile-google-maps-url" className="text-sm font-medium">
                Link Google Maps
              </label>
              <input
                id="profile-google-maps-url"
                type="url"
                value={values.googleMapsUrl}
                onChange={(event) => onChange("googleMapsUrl", event.target.value)}
                className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-ring focus:ring-4 focus:ring-ring/20"
                placeholder="https://maps.google.com/..."
                autoComplete="url"
              />
              <p className="text-xs text-muted-foreground">
                Opcional. Si lo completas, la direccion sera clickeable en la landing.
              </p>
              {errors.googleMapsUrl?.[0] ? (
                <p className="text-sm text-destructive">
                  {errors.googleMapsUrl[0]}
                </p>
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

          <div className="rounded-2xl border border-border bg-muted/50 px-4 py-3">
            <p className="text-sm font-medium">Link del tag NFC</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Se genera automaticamente a partir del slug publico del perfil.
            </p>
          </div>

          {mode === "edit" && slug ? (
            <div className="space-y-4">
              <div className="space-y-1.5">
              <label htmlFor="profile-slug" className="text-sm font-medium">
                Slug publico
              </label>
              <input
                id="profile-slug"
                value={slug}
                readOnly
                className="w-full rounded-2xl border border-input bg-muted px-4 py-3 text-sm text-muted-foreground outline-none"
              />
              <p className="text-xs text-muted-foreground">
                El slug queda fijo para no invalidar los tags NFC ya grabados.
              </p>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="profile-public-url" className="text-sm font-medium">
                  URL final del tag
                </label>
                <input
                  id="profile-public-url"
                  value={publicUrl ?? ""}
                  readOnly
                  className="w-full rounded-2xl border border-input bg-muted px-4 py-3 text-sm text-muted-foreground outline-none"
                />
              </div>
            </div>
          ) : null}

          {mode === "edit" ? (
            <label className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3">
              <div>
                <p className="text-sm font-medium">Perfil activo</p>
                <p className="text-xs text-muted-foreground">
                  Si lo desactivas, la URL publica devolvera 404.
                </p>
              </div>
              <input
                type="checkbox"
                checked={values.isActive}
                onChange={(event) => onChange("isActive", event.target.checked)}
                className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
              />
            </label>
          ) : null}

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
  );
}

export function ProfileAdminClient({
  initialProfiles,
}: ProfileAdminClientProps) {
  const [profiles, setProfiles] = useState(initialProfiles);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [formValues, setFormValues] = useState<FormValues>(emptyValues);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [listBusyId, setListBusyId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  function openCreateModal() {
    setModalMode("create");
    setSelectedProfile(null);
    setFormValues(emptyValues);
    setFieldErrors({});
    setSubmitError(null);
    setModalOpen(true);
  }

  function openEditModal(profile: Profile) {
    setModalMode("edit");
    setSelectedProfile(profile);
    setFormValues({
      name: profile.name,
      jobTitle: profile.jobTitle,
      address: profile.address,
      googleMapsUrl: profile.googleMapsUrl,
      email: profile.email,
      whatsapp: profile.whatsapp,
      isActive: profile.isActive,
    });
    setFieldErrors({});
    setSubmitError(null);
    setModalOpen(true);
  }

  function closeModal() {
    if (submitting) {
      return;
    }

    setModalOpen(false);
    setFieldErrors({});
    setSubmitError(null);
  }

  function updateFormValue(field: keyof FormValues, value: string | boolean) {
    setFormValues((current) => ({ ...current, [field]: value }));
  }

  function syncProfiles(nextProfiles: Profile[]) {
    startTransition(() => {
      setProfiles(nextProfiles);
    });
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
            address: formValues.address,
            googleMapsUrl: formValues.googleMapsUrl,
            email: formValues.email,
            whatsapp: formValues.whatsapp,
          } satisfies CreateProfileInput)
        : ({
            name: formValues.name,
            jobTitle: formValues.jobTitle,
            address: formValues.address,
            googleMapsUrl: formValues.googleMapsUrl,
            email: formValues.email,
            whatsapp: formValues.whatsapp,
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
        setFieldErrors(data.fieldErrors ?? {});
        setSubmitError(data.error ?? "No se pudo guardar el perfil.");
        return;
      }

      await refreshProfiles();

      if ("profile" in data && data.profile) {
        setSuccessMessage(
          modalMode === "create"
            ? `Perfil creado. URL publica lista: /${data.profile.slug}`
            : `Perfil actualizado. URL publica: /${data.profile.slug}`,
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
          address: profile.address,
          googleMapsUrl: profile.googleMapsUrl,
          email: profile.email,
          whatsapp: profile.whatsapp,
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
          ? `Perfil reactivado: /${profile.slug}`
          : `Perfil desactivado: /${profile.slug}`,
      );
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    } finally {
      setListBusyId(null);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Gestion interna
          </p>
          <div>
            <h1 className="text-2xl font-semibold sm:text-3xl">Perfiles NFC</h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground sm:text-base">
              Administra los perfiles que luego se mostraran al escanear cada
              tag NFC. El slug se genera solo y queda fijo.
            </p>
          </div>
        </div>
        <Button size="lg" onClick={openCreateModal}>
          Crear perfil
        </Button>
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

      <section className="overflow-hidden rounded-3xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-muted/60 text-xs uppercase tracking-[0.16em] text-muted-foreground">
              <tr>
                <th className="px-4 py-4 font-medium">Perfil</th>
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
                    colSpan={5}
                    className="px-4 py-10 text-center text-sm text-muted-foreground"
                  >
                    Todavia no hay perfiles cargados.
                  </td>
                </tr>
              ) : null}

              {profiles.map((profile) => {
                const busy = listBusyId === profile.id;
                const publicUrl = getPublicProfileUrl(profile.slug);

                return (
                  <tr
                    key={profile.id}
                    className="border-t border-border align-top"
                  >
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <p className="font-medium">{profile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {profile.jobTitle}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {profile.address}
                        </p>
                        {profile.googleMapsUrl ? (
                          <a
                            href={profile.googleMapsUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm text-primary underline-offset-4 hover:underline"
                          >
                            Abrir en Google Maps
                          </a>
                        ) : null}
                        <p className="text-sm text-muted-foreground">
                          {profile.email}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          WhatsApp: {profile.whatsapp}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Link
                        href={`/${profile.slug}`}
                        target="_blank"
                        className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                      >
                        /{profile.slug}
                      </Link>
                    </td>
                    <td className="px-4 py-4">
                      <a
                        href={publicUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="line-clamp-2 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
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
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(profile)}
                          disabled={busy}
                        >
                          Editar
                        </Button>
                        <Button
                          variant={profile.isActive ? "destructive" : "secondary"}
                          size="sm"
                          onClick={() => toggleActive(profile, !profile.isActive)}
                          disabled={busy}
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
        errors={fieldErrors}
        submitting={submitting}
        submitError={submitError}
        slug={selectedProfile?.slug}
        publicUrl={
          selectedProfile ? getPublicProfileUrl(selectedProfile.slug) : undefined
        }
        onChange={updateFormValue}
        onClose={closeModal}
        onSubmit={submitProfile}
      />
    </div>
  );
}
