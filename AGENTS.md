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

# Working Conventions

- Keep App Router code inside `src/app`.
- Prefer shared UI in `src/components` and reusable server/domain logic in `src/lib`.
- Validate request payloads with the existing Zod schemas in `src/lib/profile-schema.ts`.
- Reuse the profile service layer in `src/lib/profiles.ts` instead of duplicating MongoDB queries in route files or components.
- Preserve the current slug invariant: slugs are generated once and must stay stable so existing NFC tags do not break.
- Preserve the current visibility invariant: inactive profiles should not resolve publicly.

# Commands

- `npm run dev`
- `npm run build`
- `npm run lint`
