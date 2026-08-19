import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NFC F. Sanchez",
    short_name: "NFC",
    description: "Gestion de perfiles publicos para tags NFC.",
    start_url: "/",
    display: "minimal-ui",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    lang: "es-AR",
  };
}
