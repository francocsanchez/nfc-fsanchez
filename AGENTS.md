<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This repo uses `next@16.2.11` with the App Router under `src/app`.
Before changing routing, rendering, caching, metadata, or config behavior, read the relevant guide in `node_modules/next/dist/docs/`.

Recommended starting points for this project:

- `node_modules/next/dist/docs/01-app/01-getting-started/02-project-structure.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md`
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/page.md`
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route.md`

Heed deprecation notices and do not assume older Next.js behavior still applies.
<!-- END:nextjs-agent-rules -->

# Project Notes

This app is an NFC profile platform with two main surfaces:

- Public landing pages at `src/app/[slug]/page.tsx`
- Internal profile admin at `src/app/admin/perfiles/page.tsx`

Current project structure:

- `src/app`: routes, layouts, route handlers, global styles
- `src/components`: shared UI and client components
- `src/lib`: MongoDB access, profile domain logic, schemas, helpers

Current profile data model:

- Required: `name`, `email`
- Optional but normalized to empty strings: `jobTitle`, `address`, `googleMapsUrl`, `whatsapp`
- System fields: `slug`, `isActive`, `createdAt`, `updatedAt`

# Working Conventions

- Keep App Router code inside `src/app`.
- Prefer shared UI in `src/components` and reusable server/domain logic in `src/lib`.
- Validate request payloads with the existing Zod schemas in `src/lib/profile-schema.ts`.
- Reuse the profile service layer in `src/lib/profiles.ts` instead of duplicating MongoDB queries in route files or components.
- Preserve the current slug invariant: slugs are generated once and must stay stable so existing NFC tags do not break.
- Preserve the current visibility invariant: inactive profiles should not resolve publicly.
- Keep profile serialization backward-safe: optional string fields should continue to serialize as `""`, not `null` or `undefined`.
- Keep WhatsApp handling compatible with the current public page flow: the stored value is local digits only, while the public page builds the `wa.me/549...` URL.
- Keep Google Maps validation aligned with the current schema: only Google Maps style URLs are accepted when the field is present.
- Do not reintroduce the removed `landingUrl` field in new code. Some cleanup still exists in `src/lib/profiles.ts` only for legacy persisted records.
- Prefer server components for route pages unless client interactivity is actually needed.
- When editing dynamic route files on Windows, use literal paths for bracketed folders if shell commands need them, for example `-LiteralPath 'src/app/[slug]/page.tsx'`.

# Environment

- MongoDB config supports either `DATABASE_MONGO` or the pair `MONGODB_URI` plus `MONGODB_DB_NAME`.
- Public URL generation depends on `NEXT_PUBLIC_APP_URL`.
- `BETTER_AUTH_SECRET` is present in env scaffolding, but auth is not yet wired into the current admin flow.

# UI Notes

- The public profile page is mobile-first and intentionally more brand-forward than the admin area.
- The admin surface is a CRUD tool; favor clarity and speed over decorative UI changes there.

# Commands

- `npm run dev`
- `npm run build`
- `npm run lint`
