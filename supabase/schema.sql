-- Run once in the Supabase SQL editor, then create the owner in Authentication.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text not null default 'customer' check (role in ('owner','customer')),
  created_at timestamptz not null default now()
);

create table if not exists public.shop_settings (
  id uuid primary key default '00000000-0000-0000-0000-000000000001',
  booking_enabled boolean not null default true,
  shop_open boolean not null default true,
  paused_until timestamptz,
  updated_at timestamptz not null default now(),
  constraint singleton_settings check (id = '00000000-0000-0000-0000-000000000001')
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null check (char_length(customer_name) between 2 and 80),
  customer_phone text not null check (char_length(customer_phone) between 7 and 20),
  service text not null check (char_length(service) between 2 and 80),
  appointment_date date not null,
  appointment_time time not null,
  message text check (message is null or char_length(message) <= 500),
  status text not null default 'pending' check (status in ('pending','confirmed','completed','cancelled','no_show')),
  created_at timestamptz not null default now()
);

create unique index if not exists one_active_booking_per_slot
  on public.bookings (appointment_date, appointment_time)
  where status not in ('cancelled','no_show');

create table if not exists public.blocked_times (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  start_time time not null,
  end_time time not null,
  reason text check (reason is null or char_length(reason) <= 100),
  created_at timestamptz not null default now(),
  constraint valid_block_range check (end_time > start_time)
);

insert into public.shop_settings (id) values ('00000000-0000-0000-0000-000000000001') on conflict do nothing;

create or replace function public.is_owner()
returns boolean language sql stable security definer set search_path = public
as $$ select exists(select 1 from profiles where id = auth.uid() and role = 'owner') $$;

alter table public.profiles enable row level security;
alter table public.shop_settings enable row level security;
alter table public.bookings enable row level security;
alter table public.blocked_times enable row level security;

drop policy if exists "owner reads own profile" on public.profiles;
create policy "owner reads own profile" on public.profiles for select using (id = auth.uid());
drop policy if exists "public reads settings" on public.shop_settings;
create policy "public reads settings" on public.shop_settings for select using (true);
drop policy if exists "owner updates settings" on public.shop_settings;
create policy "owner updates settings" on public.shop_settings for update using (public.is_owner()) with check (public.is_owner());
drop policy if exists "owner reads bookings" on public.bookings;
create policy "owner reads bookings" on public.bookings for select using (public.is_owner());
drop policy if exists "owner updates bookings" on public.bookings;
create policy "owner updates bookings" on public.bookings for update using (public.is_owner()) with check (public.is_owner());
drop policy if exists "public reads blocked times" on public.blocked_times;
create policy "public reads blocked times" on public.blocked_times for select using (true);
drop policy if exists "owner manages blocked times" on public.blocked_times;
create policy "owner manages blocked times" on public.blocked_times for all using (public.is_owner()) with check (public.is_owner());

-- The only public booking write path. Checks availability inside one transaction.
create or replace function public.create_booking(
  p_customer_name text, p_customer_phone text, p_service text,
  p_appointment_date date, p_appointment_time time, p_message text default null
) returns uuid language plpgsql security definer set search_path = public as $$
declare v_settings shop_settings; v_id uuid;
begin
  select * into v_settings from shop_settings where id = '00000000-0000-0000-0000-000000000001' for share;
  if not v_settings.shop_open then raise exception using errcode='P0001', message='SHOP_CLOSED'; end if;
  if not v_settings.booking_enabled and (v_settings.paused_until is null or v_settings.paused_until > now()) then
    raise exception using errcode='P0001', message='BOOKINGS_PAUSED';
  end if;
  if p_appointment_date < current_date then raise exception using errcode='P0001', message='PAST_DATE'; end if;
  if exists(select 1 from blocked_times where date=p_appointment_date and p_appointment_time >= start_time and p_appointment_time < end_time) then
    raise exception using errcode='P0001', message='TIME_BLOCKED';
  end if;
  insert into bookings(customer_name,customer_phone,service,appointment_date,appointment_time,message)
  values(trim(p_customer_name),trim(p_customer_phone),trim(p_service),p_appointment_date,p_appointment_time,nullif(trim(p_message),''))
  returning id into v_id;
  return v_id;
exception when unique_violation then raise exception using errcode='P0001', message='SLOT_TAKEN';
end $$;

grant execute on function public.create_booking(text,text,text,date,time,text) to anon, authenticated;
do $$ begin
  if not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='shop_settings') then alter publication supabase_realtime add table public.shop_settings; end if;
  if not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='bookings') then alter publication supabase_realtime add table public.bookings; end if;
  if not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='blocked_times') then alter publication supabase_realtime add table public.blocked_times; end if;
end $$;

-- After creating the owner in Authentication, run this with their real email:
-- insert into public.profiles (id,email,role)
-- select id,email,'owner' from auth.users where email='owner@example.com'
-- on conflict(id) do update set role='owner';
