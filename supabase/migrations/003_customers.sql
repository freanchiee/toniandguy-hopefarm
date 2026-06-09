-- Customer CRM table — auto-populated on every booking
-- Used for promotions, re-engagement, loyalty tracking

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  phone text unique not null,           -- dedup key
  name text,
  email text,
  total_bookings integer default 1,
  total_spend_estimate integer default 0,
  last_service text,
  last_visit_date date,
  preferred_stylist text,
  tags text[] default '{}',             -- e.g. {vip, colour, bridal}
  whatsapp_opted_in boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table customers enable row level security;

create policy "Service role full access on customers"
  on customers for all
  using (true);

-- Auto-update updated_at
create or replace function update_customers_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger customers_updated_at
  before update on customers
  for each row execute function update_customers_updated_at();

-- RPC: safely increment booking count
create or replace function increment_customer_bookings(p_phone text)
returns void language plpgsql as $$
begin
  update customers
  set total_bookings = total_bookings + 1
  where phone = p_phone
    and created_at < now() - interval '5 seconds'; -- skip the first insert
end;
$$;
