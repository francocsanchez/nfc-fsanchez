import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Recordatorios",
    template: "%s | Recordatorios",
  },
  description:
    "PWA de recordatorios insistentes con notificaciones push recurrentes hasta completar cada tarea.",
};

export default function RemindersLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
