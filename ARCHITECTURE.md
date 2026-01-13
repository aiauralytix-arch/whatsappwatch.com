# Architecture

## System overview
- Purpose: marketing site + admin dashboard for managing WhatsApp group moderation settings.
- Primary users: WhatsApp group admins.
- Problem solved: centralized configuration of moderation rules per group.
- Explicitly out of scope: WhatsApp message ingestion/moderation, payments, analytics pipelines, notifications.

## Architecture map
**Frontend (Next.js App Router)**
- Marketing pages in `app/(static)` (`/`, `/process`, `/system`, `/stories`, `/contact`).
- Authenticated dashboard in `app/dashboard` (client UI + server actions).
- Auth pages in `app/(auth)` (`/sign-in`, `/sign-up`).
- Tailwind CSS for styling, Radix UI primitives in `components/ui`.

**Backend (Server actions only)**
- Server actions live in `src/actions/moderation/*.actions.ts` (`"use server"`).
- Business logic and Supabase access live in `src/services/moderation`.
- No custom API routes.

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

**moderation_defaults**
- One row per user (`user_id` is unique).
- Stores shared allowlist numbers and keywords applied to new groups or bulk updates.

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

**app/(static)/**
- Static marketing routes (kept separate from dashboard/auth).
- NEVER place authenticated or server action logic here.

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
- WhatsApp: conceptual only; no integration in this repo.
- Stripe/Payments: not implemented (subscription fields are placeholders).

## Environment & configuration
- Required:
  - `NEXT_PUBLIC_SUPABASE_URL` (public)
  - `SUPABASE_SERVICE_ROLE_KEY` (secret, server-only)
- Clerk env vars are required by the Clerk SDK but are not referenced in code:
  - UNKNOWN / NEEDS CONFIRMATION: exact env names and values for this project.
**src/actions/**
- Server actions only; thin orchestration wrappers around services.
- NEVER put business logic directly in action files.

**src/services/**
- Business logic and Supabase queries.
- Keep services domain-scoped (groups, settings, defaults).

**src/lib/moderation/**
- Normalization, validation, and mapping helpers.
