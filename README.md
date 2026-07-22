# NFC F. Sanchez

Plataforma de perfiles NFC construida con Next.js 16, App Router y MongoDB.

## Desarrollo local

Variables base:

```env
MONGODB_URI=mongodb://localhost:27017
DATABASE_MONGO=mongodb://localhost:27017
MONGODB_DB_NAME=nfc_fsanchez
NEXT_PUBLIC_APP_URL=http://localhost:3000
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
  -e DATABASE_MONGO=mongodb://host.docker.internal:27017 ^
  -e MONGODB_DB_NAME=nfc_fsanchez ^
  -e NEXT_PUBLIC_APP_URL=http://localhost:3000 ^
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
GHCR_OWNER=francocsanchez
IMAGE_TAG=latest
APP_PORT=3000
DATABASE_MONGO=mongodb://mongo:27017
MONGODB_DB_NAME=nfc_fsanchez
NEXT_PUBLIC_APP_URL=https://nfc.tu-dominio.com
```

Notas:

- Si el paquete de GHCR queda privado, Portainer necesita credenciales de registry con permiso de lectura.
- Si quieres usar un Mongo externo, cambia `DATABASE_MONGO` y puedes quitar el servicio `mongo` del stack.
- El volumen `nfc-fsanchez-mongo-data` persiste la base entre reinicios.

## GitHub Actions

La workflow [`.github/workflows/docker-publish.yml`](./.github/workflows/docker-publish.yml) publica la imagen en GHCR:

- Trigger en `push` a `main`
- Trigger manual con `workflow_dispatch`
- Tags `latest` y `sha-<commit>`

La imagen publicada queda en:

```text
ghcr.io/<owner-del-repo>/nfc-fsanchez:latest
```
