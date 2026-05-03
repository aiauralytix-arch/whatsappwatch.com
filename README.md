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
- `BILLING.md`: WC credits, Dodo checkout/webhooks, Whapi delete charging, and debugging SQL.

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
- `DODO_WC_TESTING_PRODUCT_ID`, `DODO_WC_STARTER_PRODUCT_ID`, `DODO_WC_GROWTH_PRODUCT_ID`, `DODO_WC_PRO_PRODUCT_ID`, `DODO_WC_POWER_PRODUCT_ID` (Dodo one-time product IDs)

For local Dodo webhook testing, set `NEXT_PUBLIC_APP_URL` to your tunnel URL and paste `${NEXT_PUBLIC_APP_URL}/api/dodo/webhook` into Dodo.

## WC credit debugging
Whapi delete billing runs through `/api/whapi/webhook`, not dashboard routes. When testing a message delete locally, the terminal should show `POST /api/whapi/webhook`; repeated `POST /dashboard?...` lines are dashboard server actions and do not exercise the delete billing path.

Useful Supabase checks:
```sql
-- Confirm a specific message delete charged 1 WC credit.
select *
from credit_ledger
where reference_type = 'whapi_message_delete'
  and reference_id = 'WHAPI_MESSAGE_ID';

-- Confirm the wallet balance for a Clerk user.
select *
from credit_wallets
where user_id = 'CLERK_USER_ID';

-- Confirm which user owned a deleted message.
select d.whapi_message_id, d.user_id, d.group_id, g.user_id as group_owner
from moderation_deleted_messages d
left join moderation_groups g on g.id = d.group_id
where d.whapi_message_id = 'WHAPI_MESSAGE_ID';
```

For local Whapi testing, the Whapi webhook URL must point to the tunnel URL for this app:
```txt
https://your-ngrok-url.ngrok-free.app/api/whapi/webhook
```

Clerk variables are required to run auth, but are not referenced directly in code. See `ARCHITECTURE.md` for notes on what is UNKNOWN/NEEDS CONFIRMATION.

## Supabase migrations
Schema lives in `supabase/migrations/*.sql`. Apply migrations in order (0001 → 0012) in the Supabase SQL editor.
