# NFC F. Sanchez

Plataforma de perfiles NFC construida con Next.js 16, App Router y MongoDB.

## Desarrollo local

Variables base:

```env
DATABASE_MONGO=mongodb://localhost:27017/nfc_fsanchez
NEXT_PUBLIC_APP_URL=http://localhost:3000
BETTER_AUTH_SECRET=replace-with-a-random-secret-of-32-chars-or-more
```

Comandos:

```bash
npm ci
npm run dev
npm run build
npm run lint
```

## Docker

El proyecto se construye con `output: "standalone"` para generar una imagen mas chica y lista para produccion.

Build local:

```bash
docker build -t nfc-fsanchez:local .
docker run --rm -p 3000:3000 ^
  -e DATABASE_MONGO=mongodb://host.docker.internal:27017/nfc_fsanchez ^
  -e NEXT_PUBLIC_APP_URL=http://localhost:3000 ^
  -e BETTER_AUTH_SECRET=replace-with-a-random-secret-of-32-chars-or-more ^
  nfc-fsanchez:local
```

Healthcheck:

```text
GET /api/health
```

## Portainer

Se incluye [docker-compose.yml](./docker-compose.yml) listo para usar como stack en Portainer.

1. Publica el repo en GitHub.
2. Deja correr la workflow `Build and Publish Docker Image`.
3. En Portainer crea un stack usando `docker-compose.yml`.
4. Carga las variables de `.env.portainer.example`.
5. Despliega el stack.

Variables recomendadas para el stack:

```env
DATABASE_MONGO=mongodb://admin:TU_PASSWORD@192.168.100.31:27017/nfc-fsanchez?authSource=admin
NEXT_PUBLIC_APP_URL=https://nfc.tu-dominio.com
BETTER_AUTH_SECRET=genera-un-secreto-largo-y-aleatorio
```

## Auth de admin

Las rutas bajo `/admin` ahora usan Better Auth con email y contrasena.

- El login vive en `/login`.
- `src/proxy.ts` redirige a `/login` cuando no hay sesion valida.
- `src/app/admin/layout.tsx` y las APIs de administracion vuelven a validar la sesion en servidor.
- Better Auth usa MongoDB para persistir usuarios, cuentas y sesiones.

Notas:

- Si el paquete de GHCR queda privado, Portainer necesita credenciales de registry con permiso de lectura.
- El stack esta pensado para Mongo externo, igual que `intraNIC`: Portainer solo levanta la app y le inyecta `DATABASE_MONGO`.
- El puerto publicado queda fijo en `32768:3000`.
- La URI debe incluir el nombre de la base en la ruta, por ejemplo `mongodb://usuario:password@host:27017/nfc-fsanchez?authSource=admin`.

## GitHub Actions

La workflow [`.github/workflows/docker-publish.yml`](./.github/workflows/docker-publish.yml) publica la imagen en GHCR:

- Trigger en `push` a `main`
- Trigger manual con `workflow_dispatch`
- Tags `latest` y `sha-<commit>`

La imagen publicada queda en:

```text
ghcr.io/<owner-del-repo>/nfc-fsanchez:latest
```
