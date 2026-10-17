-- ROAMIO Phase 1: fictional properties and test-only booking backend.
-- Run in a NEW Supabase project using SQL Editor. No payments are collected.
create extension if not exists pgcrypto;
create extension if not exists btree_gist;

create table if not exists public.demo_properties (
 id integer primary key,
 slug text not null unique,
 title text not null,
 nightly_centavos integer not null check(nightly_centavos >= 0),
 max_guests integer not null check(max_guests > 0),
 is_active boolean not null default true
);
insert into public.demo_properties (id,slug,title,nightly_centavos,max_guests) values
 (1,'siargao-palm-hideaway','Palm Hideaway Villa',580000,4),
 (2,'baguio-pine-cabin','The Pinewood Cabin',420000,6),
 (3,'tagaytay-skyline-loft','Skyline View Loft',310000,2),
 (4,'el-nido-casa-azul','Casa Azul Retreat',740000,4),
 (5,'makati-urban-nest','Urban Nest Studio',265000,2),
 (6,'la-union-surf-house','Salt & Surf House',490000,5),
 (7,'cebu-garden-suite','Garden Haven Suite',330000,3),
 (8,'batangas-poolside-villa','Soleil Poolside Villa',890000,8)
on conflict (id) do update set slug=excluded.slug,title=excluded.title,nightly_centavos=excluded.nightly_centavos,max_guests=excluded.max_guests;

create table if not exists public.favorites (
 user_id uuid not null references auth.users(id) on delete cascade,
 property_id integer not null references public.demo_properties(id) on delete cascade,
 created_at timestamptz not null default now(),
 primary key(user_id,property_id)
);

create table if not exists public.bookings (
 id uuid primary key default gen_random_uuid(),
 guest_id uuid not null references auth.users(id) on delete cascade,
 property_id integer not null references public.demo_properties(id),
 checkin date not null,
 checkout date not null,
 guests integer not null check(guests > 0),
 total_centavos bigint not null check(total_centavos >= 0),
 status text not null default 'confirmed' check(status in ('confirmed','cancelled')),
 created_at timestamptz not null default now(),
 constraint valid_date_range check(checkout > checkin),
 constraint no_overlap_confirmed exclude using gist (
   property_id with =,
   daterange(checkin,checkout,'[)') with &&
 ) where (status='confirmed')
);
create index if not exists bookings_guest_created_idx on public.bookings(guest_id,created_at desc);

alter table public.demo_properties enable row level security;
alter table public.favorites enable row level security;
alter table public.bookings enable row level security;

create policy "Published demo properties are readable" on public.demo_properties for select to anon,authenticated using (is_active);
create policy "Users read own favorites" on public.favorites for select to authenticated using ((select auth.uid())=user_id);
create policy "Users add own favorites" on public.favorites for insert to authenticated with check ((select auth.uid())=user_id);
create policy "Users delete own favorites" on public.favorites for delete to authenticated using ((select auth.uid())=user_id);
create policy "Users read own bookings" on public.bookings for select to authenticated using ((select auth.uid())=guest_id);

-- Restrict mutations to narrowly scoped definer RPCs, not arbitrary table updates.
revoke all on public.demo_properties from anon,authenticated;
revoke all on public.favorites from anon,authenticated;
revoke all on public.bookings from anon,authenticated;
grant select on public.demo_properties to anon,authenticated;
grant select,insert,delete on public.favorites to authenticated;
grant select on public.bookings to authenticated;

create or replace function public.create_demo_booking(p_property_id integer,p_checkin date,p_checkout date,p_guests integer)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
 v_guest uuid := auth.uid();
 v_property public.demo_properties%rowtype;
 v_id uuid;
 v_today date := (now() at time zone 'Asia/Manila')::date;
begin
 if v_guest is null then raise exception 'Sign in required'; end if;
 if p_checkin is null or p_checkout is null or p_checkin < v_today or p_checkout <= p_checkin or p_checkout > p_checkin+30 then
   raise exception 'Choose a future stay of 1 to 30 nights';
 end if;
 select * into v_property from public.demo_properties where id=p_property_id and is_active=true;
 if not found then raise exception 'Property unavailable'; end if;
 if p_guests is null or p_guests < 1 or p_guests > v_property.max_guests then raise exception 'Invalid guest count'; end if;
 insert into public.bookings (guest_id,property_id,checkin,checkout,guests,total_centavos)
 values (v_guest,p_property_id,p_checkin,p_checkout,p_guests,(p_checkout-p_checkin)*v_property.nightly_centavos)
 returning id into v_id;
 return v_id;
exception
 when exclusion_violation then raise exception 'These dates are already booked. Please select another range';
end;
$$;
create or replace function public.cancel_demo_booking(p_booking_id uuid)
returns void language plpgsql security definer set search_path = ''
as $$
begin
 if auth.uid() is null then raise exception 'Sign in required';end if;
 update public.bookings set status='cancelled' where id=p_booking_id and guest_id=auth.uid() and status='confirmed';
 if not found then raise exception 'Booking not found or already cancelled'; end if;
end;
$$;
revoke all on function public.create_demo_booking(integer,date,date,integer) from public,anon;
revoke all on function public.cancel_demo_booking(uuid) from public,anon;
grant execute on function public.create_demo_booking(integer,date,date,integer) to authenticated;
grant execute on function public.cancel_demo_booking(uuid) to authenticated;
