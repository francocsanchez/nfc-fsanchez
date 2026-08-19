"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next");
  const callbackURL =
    nextParam && nextParam.startsWith("/")
      ? nextParam
      : "/credenciales/perfiles/admin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Completa email y contrasena.");
      return;
    }

    setPending(true);

    try {
      const response = await fetch("/api/auth/sign-in/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: email.trim(),
          password,
          rememberMe: true,
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as
          | { message?: string; code?: string }
          | null;

        if (data?.code === "INVALID_EMAIL_OR_PASSWORD") {
          setError("Email o contrasena incorrectos.");
        } else if (data?.message) {
          setError(data.message);
        } else {
          setError("No se pudo iniciar sesion.");
        }

        return;
      }

      router.replace(callbackURL);
      router.refresh();
    } catch {
      setError("No se pudo iniciar sesion.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          Email
        </label>
        <input
          id="email"
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

      <div className="space-y-1.5">
        <label htmlFor="password" className="text-sm font-medium text-foreground">
          Contrasena
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="Tu contrasena"
          className="w-full border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-foreground focus:ring-4 focus:ring-foreground/10"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={pending}
          required
        />
      </div>

      {error ? (
        <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="flex justify-end">
        <Link
          href="/recuperar-password"
          className="text-sm text-muted-foreground transition hover:text-foreground"
        >
          Olvide mi contrasena
        </Link>
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Ingresando..." : "Ingresar"}
      </Button>
    </form>
  );
}
