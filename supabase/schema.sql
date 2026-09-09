create extension if not exists "uuid-ossp";

create type public.user_role as enum ('customer', 'provider', 'admin');
create type public.approval_status as enum ('pending', 'approved', 'rejected');
create type public.booking_status as enum ('requested', 'confirmed', 'cancelled', 'completed', 'payment_failed');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role public.user_role not null default 'customer',
  phone text,
  created_at timestamptz not null default now()
);

create table public.provider_profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  display_name text not null,
  service_category text not null check (service_category in ('cleaning','housekeeping','electrical','plumbing','moving')),
  bio text,
  city text not null default 'Amsterdam',
  hourly_rate numeric(10,2) not null check (hourly_rate > 0),
  approval_status public.approval_status not null default 'pending',
  stripe_account_id text,
  rating numeric(3,2) not null default 0,
  review_count integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.provider_availability (
  id uuid primary key default uuid_generate_v4(),
  provider_id uuid not null references public.provider_profiles(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  is_booked boolean not null default false
);

create table public.bookings (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid not null references public.profiles(id),
  provider_id uuid not null references public.provider_profiles(id),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  hourly_rate numeric(10,2) not null,
  subtotal numeric(10,2) not null,
  platform_fee numeric(10,2) not null,
  total numeric(10,2) not null,
  status public.booking_status not null default 'requested',
  stripe_checkout_session_id text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.provider_profiles enable row level security;
alter table public.provider_availability enable row level security;
alter table public.bookings enable row level security;

create policy "Public can view approved providers" on public.provider_profiles for select using (approval_status = 'approved');
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Providers can edit own provider profile" on public.provider_profiles for update using (auth.uid() = user_id);
create policy "Customers can view own bookings" on public.bookings for select using (auth.uid() = customer_id);
create policy "Providers can view their bookings" on public.bookings for select using (auth.uid() = (select user_id from public.provider_profiles where id = provider_id));
create policy "Customers can create bookings" on public.bookings for insert with check (auth.uid() = customer_id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name) values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
