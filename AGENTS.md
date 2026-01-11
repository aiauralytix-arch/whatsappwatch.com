# AGENTS.md

Guidance for AI agents working on this repo. Keep changes minimal and aligned with the current app/router structure.

## Repo intent
- Marketing site + authenticated dashboard to configure WhatsApp group moderation settings.
- No WhatsApp bot, no payments, no analytics pipeline in this codebase.

## Route groups
- `app/(static)`: marketing pages only.
- `app/(auth)`: Clerk sign-in/sign-up routes only.
- `app/dashboard`: authenticated UI + server actions.

## Server/client boundaries
- Server actions live in `app/**/actions.ts` and use `"use server"`.
- `lib/supabase.ts` uses the service role key; never import it into client components.

## Data model rules
- Update `types/supabase.ts` with every schema change.
- Add new SQL migrations in `supabase/migrations/` instead of editing old ones.

## Caution areas
- `middleware.ts` controls route protection; keep it lean and auth-focused.
- `app/dashboard/page.tsx` is client-only; auth gating is middleware + a client redirect.
