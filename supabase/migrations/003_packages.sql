-- Run this in your Supabase dashboard SQL editor
-- Project: zqekdxhoaolffsuhoibq (toniandguywhitefield)

-- Package definitions (Rishav manages these)
create table if not exists salon_packages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  price_inr   int  not null,          -- actual money charged
  credit_inr  int  not null,          -- service value credited (always >= price)
  is_active   boolean default true,
  created_at  timestamptz default now()
);

-- Customers who hold a package
create table if not exists customer_packages (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  phone             text not null,
  email             text,
  package_id        uuid references salon_packages(id),
  credit_remaining  int  not null,    -- starts at salon_packages.credit_inr
  notes             text,
  added_by          text default 'staff',
  created_at        timestamptz default now()
);

-- Deduction log — one row per service done
create table if not exists package_transactions (
  id                    uuid primary key default gen_random_uuid(),
  customer_package_id   uuid references customer_packages(id) on delete cascade,
  service_name          text not null,
  amount_deducted       int  not null,
  performed_by          text,
  created_at            timestamptz default now()
);

-- RLS: only service role can read/write (admin API uses service role key)
alter table salon_packages       enable row level security;
alter table customer_packages    enable row level security;
alter table package_transactions enable row level security;

-- No public access — service role bypasses RLS automatically
