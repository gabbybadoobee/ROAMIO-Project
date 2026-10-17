-- Apply AFTER 001_demo_booking.sql. ROAMIO prototype, no payment processing.
create extension if not exists pgcrypto;
create extension if not exists btree_gist;
create table if not exists public.platform_admins(user_id uuid primary key references auth.users(id) on delete cascade);
create table if not exists public.host_listings(
 id uuid primary key default gen_random_uuid(),host_id uuid not null references auth.users(id) on delete cascade,
 title text not null check(length(title) between 2 and 120),description text not null check(length(description) between 20 and 2000),
 city text not null check(length(city) between 2 and 120),province text not null check(length(province) between 2 and 120),
 price_centavos integer not null check(price_centavos between 10000 and 100000000),
 max_guests integer not null check(max_guests between 1 and 30),image_url text check(image_url is null or (image_url ~ '^https://[^[:space:]]+$' and length(image_url)<=2048)),
 latitude double precision check(latitude between -90 and 90),longitude double precision check(longitude between -180 and 180),
 status text not null default 'pending' check(status in ('pending','published','rejected')),
 created_at timestamptz not null default now()
);
create index if not exists host_listings_status_idx on public.host_listings(status,created_at desc);
create index if not exists host_listings_host_idx on public.host_listings(host_id);
create table if not exists public.listing_blocks(
 id uuid primary key default gen_random_uuid(),listing_id uuid not null references public.host_listings(id) on delete cascade,
 start_date date not null,end_date date not null,created_at timestamptz not null default now(),
 constraint valid_block_dates check(end_date>start_date),
 constraint no_overlapping_blocks exclude using gist(listing_id with =,daterange(start_date,end_date,'[)') with &&)
);
create table if not exists public.host_bookings(
 id uuid primary key default gen_random_uuid(),listing_id uuid not null references public.host_listings(id),
 guest_id uuid not null references auth.users(id),start_date date not null,end_date date not null,
 guests integer not null check(guests between 1 and 30),total_centavos bigint not null check(total_centavos>=0),
 status text not null default 'confirmed' check(status in ('confirmed','cancelled')),
 created_at timestamptz not null default now(),
 constraint valid_host_dates check(end_date>start_date),
 constraint no_overlap_host_bookings exclude using gist(listing_id with =,daterange(start_date,end_date,'[)') with &&) where(status='confirmed')
);
create index if not exists host_bookings_guest_idx on public.host_bookings(guest_id,created_at desc);
create index if not exists host_bookings_listing_idx on public.host_bookings(listing_id,created_at desc);
create table if not exists public.listing_favorites(user_id uuid not null references auth.users(id) on delete cascade,listing_id uuid not null references public.host_listings(id) on delete cascade,created_at timestamptz not null default now(),primary key(user_id,listing_id));
create table if not exists public.direct_messages(id uuid primary key default gen_random_uuid(),sender_id uuid not null references auth.users(id),recipient_id uuid not null references auth.users(id),body text not null check(length(trim(body)) between 1 and 2000),created_at timestamptz not null default now(),check(sender_id<>recipient_id));
create index if not exists direct_messages_from_idx on public.direct_messages(sender_id,recipient_id,created_at);
create index if not exists direct_messages_to_idx on public.direct_messages(recipient_id,sender_id,created_at);
create table if not exists public.listing_reviews(id uuid primary key default gen_random_uuid(),listing_id uuid not null references public.host_listings(id),guest_id uuid not null references auth.users(id),rating integer not null check(rating between 1 and 5),comment text not null check(length(trim(comment)) between 10 and 1000),created_at timestamptz not null default now(),unique(listing_id,guest_id));

-- Never allow clients to set moderation state by INSERT/UPDATE. Enforce via trigger.
create or replace function public.force_pending_host_listing() returns trigger language plpgsql set search_path='' as $$begin
 if tg_op='INSERT' then new.status:='pending'; new.host_id:=auth.uid();end if;
 if tg_op='UPDATE' then new.status:=old.status;new.host_id:=old.host_id;end if;
 return new;end;$$;
create trigger enforce_pending_host_listing before insert or update on public.host_listings for each row execute function public.force_pending_host_listing();

alter table public.platform_admins enable row level security;
alter table public.host_listings enable row level security;
alter table public.listing_blocks enable row level security;
alter table public.host_bookings enable row level security;
alter table public.listing_favorites enable row level security;
alter table public.direct_messages enable row level security;
alter table public.listing_reviews enable row level security;

create policy "Admins can read own designation" on public.platform_admins for select to authenticated using(user_id=(select auth.uid()));
create policy "Published or owned or admin listings visible" on public.host_listings for select to anon,authenticated using(status='published' or host_id=(select auth.uid()) or exists(select 1 from public.platform_admins a where a.user_id=(select auth.uid())));
create policy "Authenticated hosts insert listings" on public.host_listings for insert to authenticated with check(host_id=(select auth.uid()) and status='pending');
create policy "Hosts delete unbooked own listings" on public.host_listings for delete to authenticated using(host_id=(select auth.uid()) and not exists(select 1 from public.host_bookings b where b.listing_id=id));
create policy "Readable blocks" on public.listing_blocks for select to anon,authenticated using(exists(select 1 from public.host_listings l where l.id=listing_id and (l.status='published' or l.host_id=(select auth.uid()))));
create policy "Host blocks own dates" on public.listing_blocks for insert to authenticated with check(exists(select 1 from public.host_listings l where l.id=listing_id and l.host_id=(select auth.uid())));
create policy "Host removes own date blocks" on public.listing_blocks for delete to authenticated using(exists(select 1 from public.host_listings l where l.id=listing_id and l.host_id=(select auth.uid())));
create policy "Booking visible to guest or host" on public.host_bookings for select to authenticated using(guest_id=(select auth.uid()) or exists(select 1 from public.host_listings l where l.id=listing_id and l.host_id=(select auth.uid())));
create policy "Own favorites visible" on public.listing_favorites for select to authenticated using(user_id=(select auth.uid()));
create policy "Own favorites insert" on public.listing_favorites for insert to authenticated with check(user_id=(select auth.uid()));
create policy "Own favorites delete" on public.listing_favorites for delete to authenticated using(user_id=(select auth.uid()));
create policy "Conversation participants read" on public.direct_messages for select to authenticated using(sender_id=(select auth.uid()) or recipient_id=(select auth.uid()));
create policy "Sender inserts" on public.direct_messages for insert to authenticated with check(sender_id=(select auth.uid()));
create policy "Public reviews readable" on public.listing_reviews for select to anon,authenticated using(exists(select 1 from public.host_listings l where l.id=listing_id and l.status='published'));
create policy "Past confirmed guests review" on public.listing_reviews for insert to authenticated with check(guest_id=(select auth.uid()) and exists(select 1 from public.host_bookings b where b.listing_id=listing_reviews.listing_id and b.guest_id=(select auth.uid()) and b.status='confirmed' and b.end_date<=(now() at time zone 'Asia/Manila')::date));

revoke all on public.platform_admins,public.host_listings,public.host_bookings,public.listing_favorites,public.listing_blocks,public.direct_messages,public.listing_reviews from anon,authenticated;
grant select on public.host_listings,public.listing_blocks,public.listing_reviews to anon,authenticated;
grant select on public.platform_admins,public.host_bookings to authenticated;
grant insert,delete on public.host_listings,public.listing_favorites,public.listing_blocks to authenticated;
grant select,insert on public.listing_favorites,public.direct_messages,public.listing_reviews to authenticated;

-- serialize simultaneous reservation and blocking activity for each listing using FOR UPDATE
create or replace function public.create_host_booking(p_listing_id uuid,p_start date,p_end date,p_guests integer)
returns uuid language plpgsql security definer set search_path='' as $$
declare v_guest uuid:=auth.uid();v_listing public.host_listings%rowtype;v_id uuid;v_today date:=(now() at time zone 'Asia/Manila')::date;
begin
 if v_guest is null then raise exception 'Sign in required';end if;
 if p_start is null or p_end is null or p_start<v_today or p_end<=p_start or p_end>p_start+30 then raise exception 'Choose 1 to 30 future nights';end if;
 select * into v_listing from public.host_listings where id=p_listing_id and status='published' for update;
 if not found then raise exception 'Property unavailable';end if;
 if p_guests is null or p_guests<1 or p_guests>v_listing.max_guests then raise exception 'Invalid guest count';end if;
 if v_listing.host_id=v_guest then raise exception 'Cannot book your own property';end if;
 if exists(select 1 from public.listing_blocks where listing_id=p_listing_id and daterange(start_date,end_date,'[)') && daterange(p_start,p_end,'[)')) then raise exception 'Dates blocked by host';end if;
 insert into public.host_bookings(listing_id,guest_id,start_date,end_date,guests,total_centavos)
 values(p_listing_id,v_guest,p_start,p_end,p_guests,(p_end-p_start)*v_listing.price_centavos) returning id into v_id;
 return v_id;
exception when exclusion_violation then raise exception 'Dates already booked';end;$$;
create or replace function public.cancel_host_booking(p_id uuid)
returns void language plpgsql security definer set search_path='' as $$begin
 if auth.uid() is null then raise exception 'Sign in required';end if;
 update public.host_bookings set status='cancelled' where id=p_id and guest_id=auth.uid() and status='confirmed';
 if not found then raise exception 'Booking not found';end if;end;$$;
create or replace function public.moderate_listing(p_listing_id uuid,p_approve boolean)
returns void language plpgsql security definer set search_path='' as $$begin
 if auth.uid() is null or not exists(select 1 from public.platform_admins where user_id=auth.uid()) then raise exception 'Administrator required';end if;
 update public.host_listings set status=case when p_approve then 'published' else 'rejected' end where id=p_listing_id and status='pending';
 if not found then raise exception 'No pending listing';end if;
end;$$;
-- privileged moderation updates bypass the trigger that keeps ordinary users from changing status
create or replace function public.force_pending_host_listing() returns trigger language plpgsql set search_path='' as $$begin
 if tg_op='INSERT' then new.status:='pending';new.host_id:=auth.uid();end if;
 if tg_op='UPDATE' and current_user not in ('postgres','supabase_admin') then new.status:=old.status;new.host_id:=old.host_id;end if;
 return new;end;$$;
revoke all on function public.create_host_booking(uuid,date,date,integer),public.cancel_host_booking(uuid),public.moderate_listing(uuid,boolean) from public,anon;
grant execute on function public.create_host_booking(uuid,date,date,integer),public.cancel_host_booking(uuid),public.moderate_listing(uuid,boolean) to authenticated;
-- Provision the first admin manually with a trusted SQL Editor session:
-- insert into public.platform_admins(user_id) values ('AUTH_USER_UUID_HERE');
