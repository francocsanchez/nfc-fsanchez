"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

const successMessage =
  "Si el email existe en el sistema, enviamos un enlace para restablecer la contrasena.";

export function RequestPasswordResetForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!email.trim()) {
      setError("Ingresa tu email para continuar.");
      return;
    }

    setPending(true);

    try {
      const response = await fetch("/api/auth/request-password-reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: email.trim(),
          redirectTo: `${window.location.origin}/recuperar-password/nueva`,
        }),
      });

      const data = (await response.json().catch(() => null)) as
        | { message?: string; error?: string }
        | null;

      if (!response.ok) {
        setError(data?.error || data?.message || "No se pudo enviar el email.");
        return;
      }

      setMessage(data?.message || successMessage);
    } catch {
      setError("No se pudo enviar el email.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <label htmlFor="reset-email" className="text-sm font-medium text-foreground">
          Email
        </label>
        <input
          id="reset-email"
          type="email"
          autoComplete="email"
          placeholder="fsanchez@nipponcarsrl.com.ar"
          className="w-full border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-foreground focus:ring-4 focus:ring-foreground/10"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={pending}
          required
        />
      </div>

      {error ? (
        <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {message ? (
        <div className="border border-border bg-muted px-4 py-3 text-sm text-foreground">
          {message}
        </div>
      ) : null}

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Enviando..." : "Enviar enlace"}
      </Button>
    </form>
  );
}
