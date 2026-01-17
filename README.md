# WhatsAppWatch.com

WhatsAppWatch is a Next.js app for a WhatsApp group moderation service. It provides:
- A marketing site with product messaging.
- An authenticated admin dashboard to store per-group moderation settings.

This repo is intentionally focused on configuration and management UI. It also includes a minimal Whapi webhook endpoint for rule-based message moderation (text, link previews, links, phone numbers, and group invites).

## Who it is for
- WhatsApp group admins who want automated moderation controls and a clean dashboard to manage rules.

## Explicitly out of scope
- Full WhatsApp bot orchestration beyond the basic Whapi webhook moderation.
- Payment processing (subscription fields exist but no checkout flow).
- Admin notifications or analytics beyond the static dashboard UI.

## Key docs (start here)
- `ARCHITECTURE.md`: system overview, data flow, auth model, directory map.
- `AI_NOTES.md`: invariants, sharp edges, and contribution rules for AI agents.

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

Clerk variables are required to run auth, but are not referenced directly in code. See `ARCHITECTURE.md` for notes on what is UNKNOWN/NEEDS CONFIRMATION.

## Supabase migrations
Schema lives in `supabase/migrations/*.sql`. Apply migrations in order (0001 → 0012) in the Supabase SQL editor.
