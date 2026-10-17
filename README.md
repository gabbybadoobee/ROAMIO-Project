# ROAMIO — consolidated multi-phase prototype

Philippines-first accommodation marketplace web app built with Next.js 15, React 19, TypeScript, Tailwind CSS and optional Supabase. **Fictional demo stays** plus a workflow for host-submitted marketplace listings.

## Local setup

1. Install Node.js 20.9+ and npm. Extract the archive and open the `roamio-starter` directory.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local`.
4. To enable backend: create a disposable Supabase project; run `supabase/migrations/001_demo_booking.sql` and then `supabase/migrations/002_marketplace.sql` in SQL Editor, in that order.
5. In `.env.local` set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from Supabase project settings. Never put the service-role key in client-facing variables.
6. Start `npm run dev` then visit http://localhost:3000.
7. Verify with `npm run typecheck` and `npm run build`. Deployment requires a separate review.

### Admin provisioning

Create an Auth user normally, then run in your trusted SQL Editor as a project owner (substitute real auth user UUID):

```sql
insert into public.platform_admins(user_id) values ('YOUR_USER_UUID') on conflict do nothing;
```

No UI user can promote themselves to admin.

### Pages

- `/` — original ROAMIO homepage with **fictional sample stays** and demo discovery filters.
- `/stays/[slug]` — sample property detail and test booking.
- `/auth` — Supabase authentication; `/trips` — original demo-property trips.
- `/marketplace` — **host-submitted published properties**, dynamic destination/guest/price search.
- `/marketplace/[id]` — published property details, test booking, reviews, map search link, message host.
- `/host` — create a listing and view own submissions; `/host/reservations` — host reservation view.
- `/marketplace-trips` — guest reservations on host-submitted properties, including cancellation.
- `/messages?listing=UUID` — current guest ↔ host conversation.
- `/saved` — local demo favorites and backend marketplace favorites.
- `/admin` — owner-provisioned review queue.
- `/experiences` — clearly marked future feature.

### File structure

```
src/
  app/                Next.js routes: public, auth, marketplace, host, admin, messages
  components/         Header, Explore, StayCard, BookingPanel, Marketplace
  data/stays.ts       Eight fictional demo properties
  lib/supabase.ts     Browser-only Supabase client
  lib/useAuth.ts      Auth session hook
supabase/migrations/
  001_demo_booking.sql  Demo properties, favorites, database booking RPC
  002_marketplace.sql   Host listings, messaging, reviews, moderation, booking RPC, RLS
 docs/RELEASE_STATUS.md  What is built vs. not built
```

### Limits and truth in advertising

**No live payments, verified hosts, provider map integration, host payouts, refunds, notifications, recommendation model or native mobile apps.** Bookings are test records only. Homepage search does not filter actual availability; availability is checked at reservation submission. Arbitrary external image URLs must be replaced with authenticated uploads for production.

For risks, scope gaps, and rollout blockers, see `docs/RELEASE_STATUS.md`.
