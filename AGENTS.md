# AGENTS.md

Guidance for AI agents working on this repo. Keep changes minimal and aligned with the current app/router structure.

## Repo intent
- Marketing site + authenticated dashboard to configure WhatsApp group moderation settings.
- Minimal Whapi webhook moderation (rule-based deletes), not a full WhatsApp bot.
- No payments, no analytics pipeline in this codebase.

## Route groups
- `app/(static)`: marketing pages only.
- `app/(auth)`: Clerk sign-in/sign-up routes only.
- `app/dashboard`: authenticated UI + server actions.

## Server/client boundaries
- Server actions live in `src/actions/moderation` and use `"use server"`.
- Business logic + Supabase queries live in `src/services/moderation`.
- `lib/supabase.ts` uses the service role key; never import it into client components.

## Data model rules
- Update `types/supabase.ts` with every schema change.
- Add new SQL migrations in `supabase/migrations/` instead of editing old ones.
  - Recent: `block_group_invites` toggle exists; `spam_protection_enabled` was removed.

## Caution areas
- `middleware.ts` controls route protection; keep it lean and auth-focused.
- `app/dashboard/page.tsx` is client-only; auth gating is middleware + a client redirect.
