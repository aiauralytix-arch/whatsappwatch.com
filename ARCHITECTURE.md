# Architecture

## System overview
- Purpose: marketing site + static blog + admin dashboard for managing WhatsApp group moderation settings.
- Primary users: WhatsApp group admins.
- Problem solved: centralized configuration of moderation rules per group.
- Explicitly out of scope: full WhatsApp bot orchestration, analytics pipelines, notifications.

## Architecture map
**Frontend (Next.js App Router)**
- Marketing pages in `app/(static)` (`/`, `/process`, `/system`, `/stories`, `/contact`).
- Static blog in `app/(blogs)` (`/blog`, `/blog/[slug]`) with MDX content colocated under the same route group.
- Authenticated dashboard in `app/dashboard` (client UI + server actions).
- Auth pages in `app/(auth)` (`/sign-in`, `/sign-up`).
- Tailwind CSS for styling, Radix UI primitives in `components/ui`.
- Dashboard phone inputs use a searchable country-code selector + local number pattern.

**Backend (Server actions + minimal API routes)**
- Server actions live in `src/actions/moderation/*.actions.ts` (`"use server"`).
- Business logic and Supabase access live in `src/services/moderation`.
- Minimal API routes under `app/api/whapi`:
  - `/api/whapi/webhook` handles Whapi webhook moderation.
  - `/api/whapi/groups` supports group verification lookups and returns encrypted group payloads for client-side decrypt.
- Billing API routes under `app/api/dodo`:
  - `/api/dodo/webhook` verifies Dodo webhooks and credits prepaid WC purchases.

**Auth**
- Clerk for auth (provider in `app/providers.tsx`).
- Route protection via `middleware.ts` + `lib/auth/server.ts`.
- Client redirect safety net in `app/dashboard/page.tsx`.

**Data store**
- Supabase Postgres with SQL migrations in `supabase/migrations`.
- Tables are manually defined (no ORM).

## Request/data flow
```
Browser
  -> Next.js route (App Router)
     -> middleware.ts (Clerk auth check for /dashboard)
        -> Page component
           -> Client components (Dashboard UI)
              -> Server action call (src/actions/moderation/*.actions.ts)
                 -> Supabase (service role key)
                    -> Result back to client
```

```
DashboardClient (shared phone verification state)
  -> getPhoneVerificationStatus() once on load
  -> passes verified phone state to:
     - PhoneVerificationSection
     - GroupsSection (verification instructions modal)
  -> both sections update the same shared state after OTP verify
```

```
Whapi webhook
  -> /api/whapi/webhook
     -> src/services/moderation/whapi-webhook.service.ts
        -> Supabase (service role key)
           -> Optional delete call to Whapi API
```

```
/api/whapi/groups
  -> fetch groups from Whapi
  -> sanitize payload
  -> encrypt payload (AES-GCM helper in src/lib/crypto/groups-payload.ts)
  -> client decrypt in app/dashboard/sections/groups-section.tsx
```

## Data model (Supabase)
The data model is intentionally minimal and keyed off Clerk user IDs.

**users**
- `clerk_user_id` is the primary identity for application logic.
- Used to link to `moderation_groups.user_id`.

**moderation_groups**
- One row per WhatsApp group a user configures.
- Constraints:
  - `unique (user_id, group_link)` prevents duplicate group links per user.
- Fields include `group_link`, optional `group_name`, subscription placeholders.

**moderation_settings**
- One row per group (`group_id` is unique + not null).
- Stores moderation toggles and arrays for keywords/allowlist numbers.
- `group_id` has a foreign key to `moderation_groups`.
  - Current toggles: `block_phone_numbers`, `block_links`, `block_group_invites`, `block_keywords` (applies to text and link previews).

**moderation_defaults**
- One row per user (`user_id` is unique).
- Stores shared allowlist numbers and keywords applied to new groups or bulk updates.

**moderation_deleted_messages**
- One row per deleted message (keyed by `whapi_message_id`).
- Stores message text, matched keywords, and deletion reasons for later analysis.

**credit_wallets / credit_ledger / billing_events**
- One WC credit wallet per Clerk user.
- Ledger is append-only and records the initial 20-credit grant, purchases, deductions, and adjustments.
- Billing events store Dodo webhook IDs for idempotency.

## Auth & middleware deep dive
- `lib/auth/server.ts` re-exports Clerk server helpers:
  - `authMiddleware` is `clerkMiddleware`.
  - `createRouteMatcher` builds protected route matchers.
  - `currentUser` is used in server actions.
- `middleware.ts` protects `/dashboard(.*)` and calls `auth.protect()` to enforce login.
- `middleware.ts` runs on all non-static routes via `config.matcher`, so keep it fast and edge-safe.
- `app/dashboard/page.tsx` also redirects unauthenticated users to `/sign-in` for a smoother client UX.
- Common pitfall: do not use `auth()` directly in middleware; use `auth.protect()` so Clerk handles redirects.

## Directory map (purpose + “do not”)
**app/**
- App Router routes, layouts, and server/client components.
- NEVER import server-only modules (like `lib/supabase.ts`) into client components.
- For phone verification status, prefer a parent-owned state passed via props over per-modal re-fetches.

**app/(static)/**
- Static marketing routes (kept separate from dashboard/auth).
- NEVER place authenticated or server action logic here.

**app/(blogs)/**
- Static blog route group for SEO content.
- Blog UI components live in `app/(blogs)/_components`.
- Blog MDX content lives in `app/(blogs)/content/blog`.
- Blog loading/registry helpers live under `app/(blogs)/blog/_lib`.
- Keep blog content file-backed and static unless the product explicitly moves to a CMS/database publishing model.

**app/(auth)/**
- Sign-in/up routes powered by Clerk.
- NEVER add app business logic here beyond auth screens.

**components/**
- Reusable UI building blocks (Radix + Tailwind).
- NEVER put business logic or data access here.

**lib/**
- Shared helpers and service wrappers (auth, Supabase, utility helpers).
- `lib/supabase.ts` is server-only due to service role key usage.
- NEVER import `lib/supabase.ts` in client components.

**supabase/**
- SQL migrations defining schema.
- NEVER edit existing migrations in place; add new ones for changes.

**types/**
- TypeScript models for Supabase rows and app-level DTOs.
- Keep in sync with SQL migrations and server actions.

**public/**
- Static assets only.
- NEVER store secrets or configuration here.

**middleware.ts**
- Edge middleware; keep it lean and auth-only.
- NEVER import Node-only libraries here.

## External services
- Clerk: authentication and user management.
- Supabase: Postgres storage (service role key used server-side).
- WhatsApp (via Whapi): webhook moderation + delete API calls.
- Dodo Payments: checkout sessions for prepaid WC credit packs and webhooks for purchase fulfillment.

## Environment & configuration
- Required:
  - `NEXT_PUBLIC_SUPABASE_URL` (public)
  - `SUPABASE_SERVICE_ROLE_KEY` (secret, server-only)
- Required for webhook deletes:
  - `WHAPI_API_TOKEN` (secret, server-only)
- Clerk env vars are required by the Clerk SDK but are not referenced in code:
  - UNKNOWN / NEEDS CONFIRMATION: exact env names and values for this project.
**src/actions/**
- Server actions only; thin orchestration wrappers around services.
- NEVER put business logic directly in action files.

## Verification UX notes
- Group verification instructions modal includes:
  - Step guidance for required admins (`verified phone` + `9555488118`).
  - Inline group-name edit + save.
  - Inline phone OTP form when phone is not verified.
- Avoid reintroducing a separate status fetch inside the modal; it causes a visible unverified->verified flicker.
- `GroupsSection` currently decrypts encrypted groups payload from `/api/whapi/groups` before matching groups.

**src/services/**
- Business logic and Supabase queries.
- Keep services domain-scoped (groups, settings, defaults).

**src/lib/moderation/**
- Normalization, validation, and mapping helpers.
