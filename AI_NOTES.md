# AI Notes (Codex-only mental model)

## One-paragraph mental model
This is a Next.js App Router app that serves a marketing site plus a Clerk-protected dashboard. The dashboard uses server actions to read/write Supabase tables for per-group settings and user-level shared defaults. There is no WhatsApp bot or payment pipeline here; this repo only manages configuration.

## Critical invariants & rules
- Auth is Clerk-only. `/dashboard` must stay protected by middleware + client redirect.
- `lib/supabase.ts` uses the Supabase **service role key**. It must never be imported into client components.
- `moderation_settings.group_id` is unique and not null; there is exactly one settings row per group.
- `moderation_groups.user_id` is the Clerk user ID (`users.clerk_user_id`), not a Supabase auth ID.
- `moderation_defaults.user_id` is unique; defaults are per user and reused across groups.
- Migrations are append-only; never edit old migrations in place.
- Group limit is enforced server-side (50 groups per user). Keep that logic in server actions.
- Settings arrays (`blocked_keywords`, `admin_phone_numbers`) are stored as Postgres arrays; keep them normalized to avoid duplicates.
- `app/layout.tsx` sets `dynamic = "force-dynamic"`; removing it may break auth/session expectations.

## Auth & middleware pitfalls
- Use `auth.protect()` in middleware so Clerk can redirect properly.
- Do not rely only on client checks; middleware is the real gatekeeper.
- `app/dashboard/page.tsx` is a client component and uses `useAuth()` for redirect UX; keep it light.

## Sharp edges / gotchas
- Server actions (`"use server"`) are imported into client components; do not move that logic into shared client files.
- Supabase RLS is not defined in migrations; the service role key bypasses RLS. This is powerful and dangerous.
- `app/api/graphql` exists but is empty; do not assume a GraphQL API exists.
- Static marketing routes live under `app/(static)` and auth routes under `app/(auth)`.
- Subscription fields exist in the database but there is no payment flow.
- Clerk env vars are required by the SDK but not referenced explicitly in code:
  - UNKNOWN / NEEDS CONFIRMATION: exact env variable names for this deployment.

## Contribution rules for AI agents
- Reason first: identify whether a change is server-only, client-only, or cross-boundary.
- Keep server actions in `app/**/actions.ts` files with `"use server"`.
- Avoid refactors that move server-only logic into client components.
- Update `types/supabase.ts` whenever migrations change schema.
- Add new migrations rather than editing existing SQL files.
- Keep UI-only changes in client components; keep data access in server actions.

## Testing & validation
- Primary dev loop: `npm run dev`.
- Optional checks: `npm run lint`.
- When changing schema, validate with Supabase SQL editor (manual).
