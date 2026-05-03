# AGENTS.md

Guidance for AI agents working on this repo. Keep changes minimal and aligned with the current app/router structure.

## Repo intent
- Marketing site + static blog + authenticated dashboard to configure WhatsApp group moderation settings.
- Minimal Whapi webhook moderation (rule-based deletes), not a full WhatsApp bot.
- Prepaid WC credit billing via Dodo Payments; no analytics pipeline in this codebase.

## Route groups
- `app/(static)`: marketing pages only.
- `app/(blogs)`: static blog routes, blog components, blog helpers, and MDX content.
- `app/(auth)`: Clerk sign-in/sign-up routes only.
- `app/dashboard`: authenticated UI + server actions.
- `app/(static)/pricing`: public WC credit pricing and checkout entrypoint.
- `app/api/dodo`: Dodo webhook routes only.

## Blog rules
- Blog routes are served from `app/(blogs)/blog`.
- Blog-specific UI lives in `app/(blogs)/_components`.
- Blog content lives in `app/(blogs)/content/blog/*.mdx`.
- Blog data/loading helpers live in `app/(blogs)/blog/_lib`.
- Keep blog pages static/SEO-focused; do not use Supabase or dashboard flows for blog content unless explicitly changing the publishing model.

## Server/client boundaries
- Server actions live in `src/actions/moderation` and use `"use server"`.
- Billing server actions live in `src/actions/billing` and use `"use server"`.
- Business logic + Supabase queries live in `src/services/moderation`.
- Billing business logic + Supabase queries live in `src/services/billing`.
- `lib/supabase.ts` uses the service role key; never import it into client components.

## Data model rules
- Update `types/supabase.ts` with every schema change.
- Add new SQL migrations in `supabase/migrations/` instead of editing old ones.
  - Recent: `block_group_invites` toggle exists; `spam_protection_enabled` was removed.
- WC credit billing uses `credit_wallets`, `credit_ledger`, and `billing_events`; see `BILLING.md`.
- Credit packs stay static in `src/lib/billing/credit-packs.ts` unless explicitly changing pricing management.

## Caution areas
- `middleware.ts` controls route protection; keep it lean and auth-focused.
- `app/dashboard/page.tsx` is client-only; auth gating is middleware + a client redirect.
- `app/dashboard/dashboard-client.tsx` holds shared phone verification status for dashboard sections. Keep this as the single source of truth to avoid modal flicker/regressions.
- `app/dashboard/sections/groups-section.tsx` verification modal has inline OTP + group-name update flow; preserve this UX unless explicitly changing product behavior.
- `/api/whapi/groups` returns encrypted payload and `GroupsSection` decrypts it via `src/lib/crypto/groups-payload.ts`; keep both sides aligned when editing.
- `/api/whapi/webhook` must reserve 1 WC credit before Whapi delete and refund if delete fails.
- `/api/dodo/webhook` must verify Dodo webhook signatures and rely on idempotent ledger/event writes.
