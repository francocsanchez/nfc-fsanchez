"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";

type ResetPasswordFormProps = {
  token: string;
};

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!newPassword || !confirmPassword) {
      setError("Completa la nueva contrasena y su confirmacion.");
      return;
    }

    if (newPassword.length < 8) {
      setError("La nueva contrasena debe tener al menos 8 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("La confirmacion no coincide con la nueva contrasena.");
      return;
    }

    setPending(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          token,
          newPassword,
        }),
      });

      const data = (await response.json().catch(() => null)) as
        | { message?: string; code?: string }
        | null;

      if (!response.ok) {
        if (data?.code === "INVALID_TOKEN") {
          setError("El enlace ya no es valido o vencio. Solicita uno nuevo.");
        } else if (data?.code === "PASSWORD_TOO_SHORT") {
          setError("La nueva contrasena debe tener al menos 8 caracteres.");
        } else {
          setError(data?.message || "No se pudo restablecer la contrasena.");
        }

        return;
      }

      setSuccess("Contrasena actualizada. Te redirigimos al login.");
      setTimeout(() => {
        router.replace("/login?reset=success");
        router.refresh();
      }, 1200);
    } catch {
      setError("No se pudo restablecer la contrasena.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <label htmlFor="new-password" className="text-sm font-medium text-foreground">
          Nueva contrasena
        </label>
        <input
          id="new-password"
          type="password"
          autoComplete="new-password"
          placeholder="Minimo 8 caracteres"
          className="w-full border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-foreground focus:ring-4 focus:ring-foreground/10"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          disabled={pending}
          required
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="confirm-password" className="text-sm font-medium text-foreground">
          Confirmar contrasena
        </label>
        <input
          id="confirm-password"
          type="password"
          autoComplete="new-password"
          placeholder="Repite la nueva contrasena"
          className="w-full border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-foreground focus:ring-4 focus:ring-foreground/10"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          disabled={pending}
          required
        />
      </div>

      {error ? (
        <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="border border-border bg-muted px-4 py-3 text-sm text-foreground">
          {success}
        </div>
      ) : null}

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Guardando..." : "Actualizar contrasena"}
      </Button>

      <Link
        href="/login"
        className="block text-center text-sm text-muted-foreground transition hover:text-foreground"
      >
        Volver al login
      </Link>
    </form>
  );
}
