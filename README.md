# WhatsAppWatch.com

WhatsAppWatch is a Next.js app for a WhatsApp group moderation service. It provides:
- A marketing site with product messaging.
- An authenticated admin dashboard to store per-group moderation settings.

This repo is intentionally focused on configuration and management UI. The actual message ingestion/moderation pipeline is not present here.

## Who it is for
- WhatsApp group admins who want automated moderation controls and a clean dashboard to manage rules.

## Explicitly out of scope
- WhatsApp bot/webhook infrastructure for scanning or deleting messages.
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

Clerk variables are required to run auth, but are not referenced directly in code. See `ARCHITECTURE.md` for notes on what is UNKNOWN/NEEDS CONFIRMATION.

## Supabase migrations
Schema lives in `supabase/migrations/*.sql`. Apply migrations in order (0001 → 0006) in Supabase SQL editor.
