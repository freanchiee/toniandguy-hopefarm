create extension if not exists "pgcrypto";

create table if not exists stylists (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  speciality text,
  photo_url text,
  bio text,
  active boolean default true,
  created_at timestamptz default now()
);

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price_from integer,
  price_to integer,
  duration_minutes integer,
  category text,
  active boolean default true
);

create table if not exists gallery (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  caption text,
  stylist_id uuid references stylists(id),
  created_at timestamptz default now()
);

create table if not exists enquiries (
  id uuid primary key default gen_random_uuid(),
  name text,
  phone text,
  email text,
  message text,
  created_at timestamptz default now()
);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  client_phone text not null,
  client_email text,
  stylist_id uuid references stylists(id),
  service_id uuid references services(id),
  booking_date date not null,
  booking_time time not null,
  status text default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  whatsapp_notified boolean default false,
  reminder_sent boolean default false,
  notes text,
  created_at timestamptz default now()
);

create table if not exists availability_slots (
  id uuid primary key default gen_random_uuid(),
  stylist_id uuid references stylists(id),
  slot_date date not null,
  slot_time time not null,
  is_booked boolean default false,
  booking_id uuid references bookings(id)
);

alter table stylists enable row level security;
alter table services enable row level security;
alter table gallery enable row level security;
alter table enquiries enable row level security;
alter table bookings enable row level security;
alter table availability_slots enable row level security;

create policy "Public can read active stylists"
  on stylists for select
  using (active = true);

create policy "Public can read active services"
  on services for select
  using (active = true);

create policy "Public can read gallery"
  on gallery for select
  using (true);

create policy "Public can create enquiries"
  on enquiries for insert
  with check (true);
