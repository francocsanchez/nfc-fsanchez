# NFC F. Sanchez

Plataforma de perfiles NFC construida con Next.js 16, App Router y MongoDB.

La superficie activa actual del proyecto esta enfocada en la administracion de perfiles NFC y consume autenticacion desde Auth Central.

## Desarrollo local

Variables base:

```env
DATABASE_MONGO=mongodb://localhost:27017/nfc_fsanchez
CENTRAL_AUTH_URL=http://localhost:3100
CENTRAL_AUTH_PUBLIC_URL=http://localhost:3100
CENTRAL_APP_KEY=nfc
NEXT_PUBLIC_APP_URL=http://localhost:3000
IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/<tu_imagekit_id>
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
  -e CENTRAL_AUTH_URL=http://host.docker.internal:3100 ^
  -e CENTRAL_AUTH_PUBLIC_URL=http://localhost:3100 ^
  -e CENTRAL_APP_KEY=nfc ^
  -e NEXT_PUBLIC_APP_URL=http://localhost:3000 ^
  -e IMAGEKIT_PUBLIC_KEY=your_public_key ^
  -e IMAGEKIT_PRIVATE_KEY=your_private_key ^
  -e IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id ^
  nfc-fsanchez:local
```

Healthcheck:

```text
GET /api/health
```

## Portainer

Se incluye [docker-compose.yml](/C:/apps/nfc-fsanchez/docker-compose.yml) listo para usar como stack en Portainer.

1. Publica el repo en GitHub.
2. Deja correr la workflow `Build and Publish Docker Image`.
3. En Portainer crea un stack usando `docker-compose.yml`.
4. Carga las variables de entorno necesarias.
5. Despliega el stack.

Variables recomendadas para el stack:

```env
DATABASE_MONGO=mongodb://admin:TU_PASSWORD@192.168.100.31:27017/nfc-fsanchez?authSource=admin
CENTRAL_AUTH_URL=http://auth-central:3000
CENTRAL_AUTH_PUBLIC_URL=https://auth.tu-dominio.com
CENTRAL_APP_KEY=nfc
NEXT_PUBLIC_APP_URL=https://nfc.tu-dominio.com
IMAGEKIT_PUBLIC_KEY=tu_public_key
IMAGEKIT_PRIVATE_KEY=tu_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/tu_imagekit_id
```

## Auth de admin

Las rutas privadas ya no manejan usuarios, passwords ni sesiones propias. La app consulta la sesion central con:

```text
GET {CENTRAL_AUTH_URL}/api/internal/session?appKey={CENTRAL_APP_KEY}
```

Detalles del flujo:

- La app reenvia el header `cookie` actual hacia Auth Central.
- `CENTRAL_AUTH_URL` se usa para la consulta server-to-server interna.
- `CENTRAL_AUTH_PUBLIC_URL` se usa para redirigir al usuario al login/logout central.
- Si Auth Central responde `401`, el usuario es redirigido a `{CENTRAL_AUTH_URL}/login?appKey=...&returnTo=...`.
- Si Auth Central responde `403`, la app muestra `/forbidden`.
- Si Auth Central responde `200`, la app habilita layouts y APIs privadas con la sesion devuelta.
- El logout redirige a `{CENTRAL_AUTH_PUBLIC_URL}/logout?returnTo={NEXT_PUBLIC_APP_URL}`.

Archivos principales de la integracion:

- [src/lib/auth.ts](/C:/apps/nfc-fsanchez/src/lib/auth.ts)
- [src/lib/auth-session.ts](/C:/apps/nfc-fsanchez/src/lib/auth-session.ts)
- [src/proxy.ts](/C:/apps/nfc-fsanchez/src/proxy.ts)

## Como probar con Auth Central

1. Levanta Auth Central en `http://localhost:3100`.
2. Configura en Auth Central el acceso de la app con `CENTRAL_APP_KEY=nfc` o el valor real que corresponda.
3. Inicia este proyecto con `NEXT_PUBLIC_APP_URL=http://localhost:3000`.
4. Entra a `/admin/perfiles` o `/credenciales/perfiles/admin`.
5. Verifica estos casos:
   - Sin sesion central: debe redirigir al login central.
   - Con sesion central y sin acceso a la app: debe abrir `/forbidden`.
   - Con sesion central y acceso valido: debe entrar al panel.
   - Al cerrar sesion: debe delegar el logout al sistema central.

## Notas

- El stack esta pensado para Mongo externo: Portainer solo levanta la app y le inyecta `DATABASE_MONGO`.
- El puerto publicado queda fijo en `32768:3000`.
- La URI debe incluir el nombre de la base en la ruta, por ejemplo `mongodb://usuario:password@host:27017/nfc-fsanchez?authSource=admin`.

## GitHub Actions

La workflow [`.github/workflows/docker-publish.yml`](/C:/apps/nfc-fsanchez/.github/workflows/docker-publish.yml) publica la imagen en GHCR:

- Trigger en `push` a `main`
- Trigger manual con `workflow_dispatch`
- Tags `latest` y `sha-<commit>`

La imagen publicada queda en:

```text
ghcr.io/<owner-del-repo>/nfc-fsanchez:latest
```
