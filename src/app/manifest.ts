import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Recordatorios NFC",
    short_name: "Recordatorios",
    description:
      "PWA de recordatorios insistentes con notificaciones push recurrentes.",
    start_url: "/recordatorios/app",
    display: "standalone",
    background_color: "#11141b",
    theme_color: "#f27e4d",
    lang: "es-AR",
    icons: [
      {
        src: "/icons/recordatorios-icon.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "maskable",
      },
      {
        src: "/icons/recordatorios-icon.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
