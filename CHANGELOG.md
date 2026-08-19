# Changelog

## 2026-08-19

- Se elimino completamente el modulo `/recordatorios` del proyecto, incluyendo rutas App Router, APIs, worker, service worker, componentes, esquemas y logica de dominio asociada.
- Se simplifico la portada para dejar a credenciales NFC como unica superficie activa.
- Se ajustaron `package.json`, `manifest.ts` y `AGENTS.md` para reflejar la nueva estructura del proyecto.
- Se adapto `/login` al lenguaje visual actual del proyecto para unificar acceso, home y panel administrativo.
- Se implemento la recuperacion de contrasena por email con Better Auth, SMTP y pantallas propias para solicitar y aplicar el reseteo.
- Se agrego el passthrough de variables SMTP en `docker-compose.yml` para que Portainer las inyecte correctamente al contenedor.
