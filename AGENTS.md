# AGENTS.md
# Instrucciones del proyecto

Este repositorio es un proyecto independiente.

## Aislamiento de contexto

- No utilizar información, reglas ni decisiones de otros proyectos.
- No asumir preferencias históricas del usuario.
- No reutilizar paletas, tipografías, diseños, componentes o estructuras externas.
- No incorporar nombres, marcas o contenido de otros repositorios.
- No aplicar decisiones obtenidas de conversaciones anteriores.

## Fuentes de verdad

El orden de prioridad es:

1. Las instrucciones actuales del usuario.
2. Este archivo `AGENTS.md`.
3. Los archivos existentes dentro de este repositorio.
4. La documentación oficial de las tecnologías utilizadas.

Cualquier información externa al repositorio debe ignorarse, salvo que el usuario la solicite expresamente.

## Diseño

El sistema visual debe definirse exclusivamente para este proyecto.

Antes de crear o modificar interfaces, verificar:

- paleta de colores
- tipografías
- espaciados
- bordes
- sombras
- estilo de botones
- estilo de tarjetas
- diseño responsive

Si alguno de estos puntos no está definido, no heredarlo de otro proyecto.

## Código existente

- No eliminar código funcional sin autorización.
- No cambiar la arquitectura solamente por preferencias históricas.
- Respetar las tecnologías realmente instaladas en este repositorio.
- Antes de realizar cambios grandes, revisar `package.json`, estructura de carpetas y configuración actual.

## Regla obligatoria

Cuando una instrucción parezca provenir de otro proyecto, detener su aplicación y señalarla antes de continuar.

## Proyecto

Este repositorio es una aplicacion Next.js 16 con App Router para administrar perfiles NFC publicos y un modulo de recordatorios autenticado.

Superficies principales:

- Perfil publico por slug en `src/app/[slug]/page.tsx`
- Admin de perfiles en `src/app/admin/perfiles/page.tsx`
- Login en `src/app/login/page.tsx`
- Modulo de recordatorios en `src/app/recordatorios`

## Stack y estructura

- Framework: `next@16.2.11` con App Router
- UI: React 19, Tailwind 4, componentes compartidos en `src/components`
- Datos: MongoDB
- Auth: Better Auth con email/password y sesiones en MongoDB

Carpetas relevantes:

- `src/app`: paginas, layouts y route handlers
- `src/components`: UI compartida y clientes interactivos
- `src/lib`: acceso a datos, auth, esquemas y logica de dominio
- `scripts`: utilidades de desarrollo, worker de recordatorios y seed de usuario admin

## Reglas de implementacion

- Mantener el codigo de App Router dentro de `src/app`.
- Reutilizar logica de dominio desde `src/lib` en lugar de duplicar consultas o validaciones en rutas y componentes.
- Validar entradas de perfiles con `src/lib/profile-schema.ts`.
- Validar entradas de recordatorios con `src/lib/reminder-schema.ts`.
- Preferir server components en paginas y layouts; usar client components solo cuando haga falta interactividad.
- Antes de cambiar comportamiento de routing, metadata, route handlers o rendering, revisar la documentacion local de Next en `node_modules/next/dist/docs/`.

## Invariantes del dominio

- Los perfiles publicos se resuelven por `slug`.
- Los `slug` deben permanecer estables una vez creados.
- Los perfiles inactivos no deben exponerse en la ruta publica.
- `name` y `email` son obligatorios para perfiles.
- `jobTitle`, `address`, `googleMapsUrl` y `whatsapp` se serializan como strings; evitar `null` y `undefined`.
- El campo legacy `landingUrl` no debe reintroducirse en codigo nuevo.
- `whatsapp` se guarda como digitos locales; la URL publica a WhatsApp se arma al renderizar.
- `googleMapsUrl`, cuando existe, debe seguir la validacion del esquema actual.

## Auth y acceso

- Las rutas bajo `/admin` y las APIs administrativas requieren sesion valida.
- Better Auth ya esta integrado en el codigo actual; no asumir un flujo de auth pendiente.
- La inicializacion de auth vive en `src/lib/auth.ts`.
- Las validaciones de sesion compartidas viven en `src/lib/auth-session.ts`.

## UI

- La pagina publica del perfil puede tener una identidad visual mas marcada y mobile-first.
- El admin y recordatorios deben priorizar claridad operativa, velocidad de uso y mantenimiento sencillo.
- No asumir paletas, tipografias o estilos de otras marcas o proyectos. Cualquier decision visual nueva debe justificarse dentro de este repositorio.

## Entorno

- MongoDB soporta `DATABASE_MONGO` o la combinacion `MONGODB_URI` + `MONGODB_DB_NAME`.
- La URL publica depende de `NEXT_PUBLIC_APP_URL`.
- Auth puede usar `BETTER_AUTH_URL` y `BETTER_AUTH_SECRET` segun el entorno.

## Comandos

- `npm run dev`
- `npm run dev:web`
- `npm run dev:reminder-worker`
- `npm run build`
- `npm run lint`
- `npm run seed:auth-user`
