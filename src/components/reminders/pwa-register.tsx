"use client";

import { useEffect, useState } from "react";

export function PwaRegister() {
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    navigator.serviceWorker
      .register("/recordatorios-sw.js")
      .catch((error) => {
        console.error("Failed to register service worker", error);
      });
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(display-mode: standalone)");

    function updateStandaloneState() {
      setInstalled(media.matches);
    }

    updateStandaloneState();
    media.addEventListener("change", updateStandaloneState);

    return () => {
      media.removeEventListener("change", updateStandaloneState);
    };
  }, []);

  return installed ? (
    <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-emerald-200">
      PWA instalada
    </div>
  ) : null;
}
