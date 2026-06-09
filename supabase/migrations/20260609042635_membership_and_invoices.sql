-- ── Membership on customers ────────────────────────────────────────────────
alter table customers
  add column if not exists membership boolean default false,
  add column if not exists membership_tier text check (membership_tier in ('Silver','Gold','Platinum')),
  add column if not exists membership_since date,
  add column if not exists membership_expires date;

-- ── Invoices ────────────────────────────────────────────────────────────────
create table if not exists invoices (
  id               uuid primary key default gen_random_uuid(),
  invoice_number   text unique not null,
  customer_id      uuid references customers(id),
  customer_name    text not null,
  customer_phone   text,
  items            jsonb not null default '[]',  -- [{name, qty, unit_price}]
  subtotal         integer not null default 0,   -- paise or rupees, store as integer ₹
  discount_percent integer default 0,
  discount_amount  integer default 0,
  total            integer not null default 0,
  payment_method   text default 'cash' check (payment_method in ('cash','card','upi','other')),
  status           text default 'paid' check (status in ('paid','pending','cancelled')),
  notes            text,
  invoice_date     date not null default current_date,
  created_at       timestamptz default now()
);

alter table invoices enable row level security;
create policy "Service role full access on invoices"
  on invoices for all using (true);

-- Index for revenue queries
create index if not exists invoices_date_idx on invoices(invoice_date);
create index if not exists invoices_status_idx on invoices(status);
