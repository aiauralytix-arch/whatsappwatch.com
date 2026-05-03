# WhatsAppWatch.com

WhatsAppWatch is a Next.js app for a WhatsApp group moderation service. It provides:
- A marketing site with product messaging.
- An authenticated admin dashboard to store per-group moderation settings.
- A phone verification flow (OTP on WhatsApp) used by group verification steps.
- A prepaid WC credit wallet for billing successful message deletes.

This repo is intentionally focused on configuration and management UI. It also includes a minimal Whapi webhook endpoint for rule-based message moderation (text, link previews, links, phone numbers, and group invites).

## Who it is for
- WhatsApp group admins who want automated moderation controls and a clean dashboard to manage rules.

## Explicitly out of scope
- Full WhatsApp bot orchestration beyond the basic Whapi webhook moderation.
- Admin notifications, analytics dashboards, or analytics pipelines.

## Key docs (start here)
- `ARCHITECTURE.md`: system overview, data flow, auth model, directory map.
- `AI_NOTES.md`: invariants, sharp edges, and contribution rules for AI agents.

## Current dashboard behavior (important)
- Phone numbers are entered as `country code + local number` in the dashboard UI.
- `Phone Verification` and `Groups -> Instructions to follow` both support OTP verification.
- Phone verification status is loaded once in `app/dashboard/dashboard-client.tsx` and passed down to sections to avoid modal flicker/re-fetch jumps.
- `/api/whapi/groups` now returns an encrypted payload that is decrypted in `GroupsSection` before use.

## Development quick start
```bash
npm run dev
```
Then visit `http://localhost:3000`.

## Required environment variables
These must be present or the app will fail at runtime:
- `NEXT_PUBLIC_SUPABASE_URL` (public)
- `SUPABASE_SERVICE_ROLE_KEY` (secret; server-only)
- `WHAPI_API_TOKEN` (secret; used for Whapi API calls)
- `DODO_PAYMENTS_API_KEY` (secret; used to create checkout sessions)
- `DODO_PAYMENTS_WEBHOOK_SECRET` (secret; used to verify Dodo webhooks)
- `NEXT_PUBLIC_APP_URL` (used for Dodo checkout redirects)
- `DODO_WC_STARTER_PRODUCT_ID`, `DODO_WC_GROWTH_PRODUCT_ID`, `DODO_WC_PRO_PRODUCT_ID`, `DODO_WC_POWER_PRODUCT_ID` (Dodo one-time product IDs)

For local Dodo webhook testing, set `NEXT_PUBLIC_APP_URL` to your tunnel URL and paste `${NEXT_PUBLIC_APP_URL}/api/dodo/webhook` into Dodo.

Clerk variables are required to run auth, but are not referenced directly in code. See `ARCHITECTURE.md` for notes on what is UNKNOWN/NEEDS CONFIRMATION.

## Supabase migrations
Schema lives in `supabase/migrations/*.sql`. Apply migrations in order (0001 → 0012) in the Supabase SQL editor.
