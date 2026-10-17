# ROAMIO architecture, Week 2

## Current application
- Next.js 15 App Router + React 19 + TypeScript
- Tailwind CSS 3 + small shared CSS component styles
- Static typed property dataset in `src/data/stays.ts`
- Client-side search/filter UI in `src/components/Explore.tsx`
- Server-rendered dynamic listing detail routes generated from mock data
- No API calls, databases, backend, authentication, persistence or payment processor

## Next milestones
1. Auth: Supabase login and profiles; restrict server actions by role.
2. Listings: PostgreSQL property/amenity/image schema; secure host-owned CRUD, storage, admin approval.
3. Search: server-filtered published inventory and pagination; stable public detail pages.
4. Booking: server-calculated pricing, date blocks, transaction-safe overlap prevention; tests for concurrent reservations.
5. Admin: moderation, audit logs, reporting.
6. QA: unit + E2E + security checks; staging deploy and operational monitoring.

## Recommended booking model constraints
- Date-only check-in/check-out in Philippine local calendar; checkout exclusive.
- Store event timestamps as UTC and show Asia/Manila for localized presentation.
- Store PHP monetary amounts as integer centavos; compute totals on server.
- Enforce overlapping bookings and blocked dates via transaction-safe database protection.
- Enforce RLS and independently verify authorization server-side.
- Treat the current mock ratings and photos as placeholder data, never marketing claims.

## API contracts (future; not yet implemented)
- `GET /api/properties` published listing pagination and filters
- `GET /api/properties/:slug` published listing detail
- `POST /api/host/properties` authorized host listing creation
- `POST /api/bookings` authenticated server-checked booking transaction
- `GET /api/me/bookings` signed-in guest reservation list

No route above exists in this starter; these are interface designs for future implementation.
