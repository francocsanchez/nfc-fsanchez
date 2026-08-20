# Changelog

## 2026-08-20

- Se adapto la landing publica del rol `administracion` para seguir la referencia visual entregada en `template_administracion/`, con composicion ejecutiva monocromatica y tipografia `Hanken Grotesk`.
- Se movieron `address` y `googleMapsUrl` a sucursales globales, permitiendo crear multiples sucursales y asignar una sola sucursal a cada perfil mediante `branchId`.
- Se actualizo el admin de perfiles para seleccionar sucursal por perfil y administrar sucursales desde las configuraciones globales, incluyendo bloqueo visual de eliminacion cuando una sucursal esta en uso.
- La landing publica y la descarga `.vcf` ahora resuelven direccion y Google Maps desde la sucursal asignada al perfil.
- Se reemplazo `lucide-react` por `iconoir-react` y se migraron todos los iconos activos del sistema a Iconoir.
- Se agrego el rol `administracion` al dominio de perfiles NFC, manteniendo `general` como rol legacy editable desde el admin.
- Se incorporo `instagramUrl` en validaciones, persistencia, APIs y formulario administrativo de perfiles.
- Se actualizo la landing publica por `slug` para mostrar Instagram en todos los perfiles y ocultar el catalogo fuera de los perfiles `vendedor`.
- Se extendio la descarga de contacto `.vcf` para incluir sitio web e Instagram cuando el perfil los tenga cargados.
- Se movieron `websiteUrl` e `instagramUrl` a una configuracion global compartida por todos los perfiles y se elimino su edicion individual desde el modal de perfiles.
- Se simplifico `/credenciales/perfiles/admin` moviendo la gestion y vista del catalogo a un dialog, y agregando un dialog separado para configuraciones globales.

## 2026-08-19

- Se elimino completamente el modulo `/recordatorios` del proyecto, incluyendo rutas App Router, APIs, worker, service worker, componentes, esquemas y logica de dominio asociada.
- Se simplifico la portada para dejar a credenciales NFC como unica superficie activa.
- Se ajustaron `package.json`, `manifest.ts` y `AGENTS.md` para reflejar la nueva estructura del proyecto.
- Se adapto `/login` al lenguaje visual actual del proyecto para unificar acceso, home y panel administrativo.
- Se implemento la recuperacion de contrasena por email con Better Auth, SMTP y pantallas propias para solicitar y aplicar el reseteo.
- Se agrego el passthrough de variables SMTP en `docker-compose.yml` para que Portainer las inyecte correctamente al contenedor.
