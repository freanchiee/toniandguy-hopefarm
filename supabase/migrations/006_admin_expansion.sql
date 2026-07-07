-- =====================================================================
-- 006_admin_expansion.sql
-- Salon admin dashboard expansion: roles/OTP, employees+payroll,
-- service sale tickets (multi line-item, GST toggle, package split),
-- product sales, and the read-only analytics views.
--
-- SINGLE location (no branch_id). Money = INTEGER RUPEES throughout
-- (matches invoices/salon_packages). RLS enabled on every table; the
-- app reaches these ONLY via getServerSupabase() (service role), which
-- bypasses RLS — so no anon/authenticated policies = deny-by-default.
-- =====================================================================

create extension if not exists pg_trgm;

-- shared updated_at trigger fn
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

-- ─────────────────────────────────────────────────────────────────────
-- 1. EMPLOYEES  — unified staff roster + payroll entity.
--    Drives the service line-item "hairdresser" dropdown (active only),
--    product-sale "sold by", and all incentive attribution. Deactivate,
--    never delete → historical sale rows keep their FK + name snapshot.
-- ─────────────────────────────────────────────────────────────────────
create table if not exists employees (
  id                    uuid primary key default gen_random_uuid(),
  name                  text not null,
  designation           text,
  phone                 text,
  joined_at             date not null default current_date,
  base_salary           int not null default 0,               -- monthly ₹
  incentive_pct         jsonb not null default '{}'::jsonb,   -- {"colour":7,"haircut":5,...} per priceList category
  default_incentive_pct numeric(5,2) not null default 5,      -- fallback %
  is_stylist            boolean not null default true,        -- shows in service dropdown
  active                boolean not null default true,
  created_at            timestamptz default now(),
  updated_at            timestamptz default now()
);
create index if not exists employees_active_idx on employees(active);
drop trigger if exists employees_updated_at on employees;
create trigger employees_updated_at before update on employees
  for each row execute function set_updated_at();

-- ─────────────────────────────────────────────────────────────────────
-- 2. PRODUCTS  — master list (super_admin CRUD). price = incentive base.
-- ─────────────────────────────────────────────────────────────────────
create table if not exists products (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  category    text,
  price       int not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);
create index if not exists products_active_idx on products(is_active);
drop trigger if exists products_updated_at on products;
create trigger products_updated_at before update on products
  for each row execute function set_updated_at();

-- ─────────────────────────────────────────────────────────────────────
-- 3. CUSTOMERS EXTENSION  (existing table — add columns only)
-- ─────────────────────────────────────────────────────────────────────
alter table customers add column if not exists gender text;
alter table customers add column if not exists last_ticket_at timestamptz;
alter table customers add column if not exists phone_digits text
  generated always as (regexp_replace(coalesce(phone,''), '\D', '', 'g')) stored;
create index if not exists customers_phone_digits_idx on customers(phone_digits);
create index if not exists customers_name_trgm_idx on customers using gin (lower(name) gin_trgm_ops);

-- ─────────────────────────────────────────────────────────────────────
-- 4. SERVICE SALE TICKETS  (bill header — one per completed sale)
-- ─────────────────────────────────────────────────────────────────────
create sequence if not exists ticket_invoice_seq;

create table if not exists service_sale_tickets (
  id              uuid primary key default gen_random_uuid(),
  booking_id      uuid references bookings(id) on delete set null,
  customer_id     uuid references customers(id) on delete set null,
  customer_name   text not null,
  customer_phone  text,
  sale_at         timestamptz not null default now(),     -- backdatable
  status          text not null default 'final',           -- final | void

  subtotal        int not null default 0,                  -- Σ charged_price (pre-discount, pre-tax)
  discount_type   text not null default 'none' check (discount_type in ('none','percent','amount')),
  discount_value  numeric(10,2) not null default 0,
  discount_amount int not null default 0,
  taxable_amount  int not null default 0,                  -- subtotal - discount_amount

  is_gst          boolean not null default false,          -- per-bill toggle
  gst_rate        numeric(5,2) not null default 0,
  cgst_amount     int not null default 0,
  sgst_amount     int not null default 0,
  tax_amount      int not null default 0,
  gstin           text,

  grand_total     int not null default 0,                  -- taxable_amount + tax_amount
  package_paid    int not null default 0,                  -- ₹ covered by package redemption
  cash_paid       int not null default 0,
  card_paid       int not null default 0,
  upi_paid        int not null default 0,
  wallet_paid     int not null default 0,
  payment_mode    text,                                    -- cash|card|upi|wallet|package|split

  invoice_number  text unique,
  notes           text,
  logged_by       text,                                    -- admin username from cookie
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);
create index if not exists tickets_sale_at_idx  on service_sale_tickets(sale_at desc);
create index if not exists tickets_customer_idx on service_sale_tickets(customer_id);
create index if not exists tickets_booking_idx  on service_sale_tickets(booking_id);
drop trigger if exists tickets_updated_at on service_sale_tickets;
create trigger tickets_updated_at before update on service_sale_tickets
  for each row execute function set_updated_at();

-- ─────────────────────────────────────────────────────────────────────
-- 5. SERVICE SALE ITEMS  (line items — own price + own employee)
-- ─────────────────────────────────────────────────────────────────────
create table if not exists service_sale_items (
  id                 uuid primary key default gen_random_uuid(),
  ticket_id          uuid not null references service_sale_tickets(id) on delete cascade,
  service_id         uuid references services(id) on delete set null,
  service_name       text not null,
  category           text,                                 -- priceList group key (incentive/report bucket)
  employee_id        uuid references employees(id) on delete set null,
  employee_name      text,                                 -- snapshot
  menu_price         int not null,                         -- NORMAL menu price → incentive base
  charged_price      int not null,                         -- actual line price
  package_amount     int not null default 0,               -- ₹ of this line paid from package
  is_package_redeemed boolean not null default false,
  incentive_pct      numeric(5,2),                         -- snapshot at sale time
  incentive_amount   int not null default 0,               -- round(menu_price * pct/100)
  created_at         timestamptz default now()
);
create index if not exists items_ticket_idx     on service_sale_items(ticket_id);
create index if not exists items_employee_idx   on service_sale_items(employee_id);
create index if not exists items_category_idx   on service_sale_items(category);

-- ─────────────────────────────────────────────────────────────────────
-- 6. PACKAGE REDEMPTIONS  (bridge ticket ⇄ customer_packages; split-aware)
-- ─────────────────────────────────────────────────────────────────────
create table if not exists package_redemptions (
  id                     uuid primary key default gen_random_uuid(),
  ticket_id              uuid not null references service_sale_tickets(id) on delete cascade,
  item_id                uuid references service_sale_items(id) on delete cascade,
  customer_package_id    uuid not null references customer_packages(id),
  package_transaction_id uuid references package_transactions(id),
  service_name           text not null,
  amount_redeemed        int not null,
  split_cash_card        int not null default 0,
  created_at             timestamptz default now()
);
create index if not exists redemptions_ticket_idx on package_redemptions(ticket_id);
create index if not exists redemptions_cpkg_idx    on package_redemptions(customer_package_id);

-- ─────────────────────────────────────────────────────────────────────
-- 7. PRODUCT SALES  (one row per line item)
-- ─────────────────────────────────────────────────────────────────────
create table if not exists product_sales (
  id               uuid primary key default gen_random_uuid(),
  product_id       uuid references products(id),
  product_name     text not null,                          -- snapshot
  quantity         int not null default 1 check (quantity > 0),
  unit_price       int not null default 0,                 -- editable
  menu_price       int not null default 0,                 -- product.price snapshot → incentive base
  customer_id      uuid references customers(id),
  customer_name    text,
  customer_phone   text,
  employee_id      uuid references employees(id),          -- who sold it (incentive)
  employee_name    text,                                   -- snapshot
  payment_mode     text not null default 'cash' check (payment_mode in ('cash','card','upi','wallet')),
  discount_percent int not null default 0,
  discount_amount  int not null default 0,
  gross_amount     int not null default 0,                 -- qty * unit_price
  taxable_amount   int not null default 0,                 -- gross - discount
  is_gst           boolean not null default false,
  gst_rate         numeric(5,2) not null default 0,
  cgst_amount      int not null default 0,
  sgst_amount      int not null default 0,
  tax_amount       int not null default 0,
  total_amount     int not null default 0,                 -- taxable + tax
  sold_by          text,                                   -- admin username who logged it
  sale_date        date not null default current_date,
  notes            text,
  created_at       timestamptz default now()
);
create index if not exists product_sales_date_idx     on product_sales(sale_date);
create index if not exists product_sales_employee_idx on product_sales(employee_id);
create index if not exists product_sales_customer_idx on product_sales(customer_id);
create index if not exists product_sales_product_idx  on product_sales(product_id);

-- ─────────────────────────────────────────────────────────────────────
-- 8. PAYSLIPS  (one per employee per month; lockable)
-- ─────────────────────────────────────────────────────────────────────
create table if not exists payslips (
  id                  uuid primary key default gen_random_uuid(),
  employee_id         uuid not null references employees(id),
  period              date not null,                        -- day-1 of month
  base_salary         int not null default 0,
  paid_days           int not null default 0,
  month_days          int not null default 30,
  base_earned         int not null default 0,               -- round(base_salary*paid_days/month_days)
  incentive_total     int not null default 0,
  incentive_breakdown jsonb not null default '[]'::jsonb,   -- [{category,menu_revenue,pct,incentive}]
  bonus               int not null default 0,
  overtime            int not null default 0,
  advance_deduction   int not null default 0,
  other_deduction     int not null default 0,
  net_pay             int not null default 0,
  notes               text,
  locked              boolean not null default false,
  locked_at           timestamptz,
  locked_by           text,
  generated_at        timestamptz default now(),
  updated_at          timestamptz default now(),
  unique (employee_id, period)
);
create index if not exists payslips_period_idx   on payslips(period);
create index if not exists payslips_employee_idx on payslips(employee_id);
drop trigger if exists payslips_updated_at on payslips;
create trigger payslips_updated_at before update on payslips
  for each row execute function set_updated_at();

-- Lock guard: block UPDATE of a locked payslip unless it is being unlocked.
create or replace function guard_locked_payslip()
returns trigger language plpgsql as $$
begin
  if OLD.locked = true and NEW.locked = true then
    raise exception 'payslip % is locked for period %', OLD.id, OLD.period
      using errcode = 'check_violation';
  end if;
  return NEW;
end; $$;
drop trigger if exists payslips_lock_guard on payslips;
create trigger payslips_lock_guard before update on payslips
  for each row execute function guard_locked_payslip();

-- ─────────────────────────────────────────────────────────────────────
-- 9. SUPER ADMIN AUTH  (OTP challenge store + login audit log)
-- ─────────────────────────────────────────────────────────────────────
create table if not exists super_admin_otp (
  id          uuid primary key default gen_random_uuid(),
  phone       text not null,                                -- masked owner number
  code_hash   text not null,                                -- sha256(otp + OTP_PEPPER)
  expires_at  timestamptz not null,
  consumed_at timestamptz,
  attempts    int not null default 0,
  created_ip  text,
  created_at  timestamptz not null default now()
);
create index if not exists super_admin_otp_active_idx on super_admin_otp(created_at desc) where consumed_at is null;

create table if not exists super_admin_login_log (
  id         uuid primary key default gen_random_uuid(),
  event      text not null check (event in ('otp_requested','verify_success','verify_fail','locked_out','logout')),
  phone      text,
  ip         text,
  user_agent text,
  detail     text,
  created_at timestamptz not null default now()
);
create index if not exists sa_login_log_recent_idx on super_admin_login_log(event, created_at desc);

-- ─────────────────────────────────────────────────────────────────────
-- 10. RLS  (deny-by-default; service role bypasses)
-- ─────────────────────────────────────────────────────────────────────
alter table employees            enable row level security;
alter table products             enable row level security;
alter table service_sale_tickets enable row level security;
alter table service_sale_items   enable row level security;
alter table package_redemptions  enable row level security;
alter table product_sales        enable row level security;
alter table payslips             enable row level security;
alter table super_admin_otp      enable row level security;
alter table super_admin_login_log enable row level security;

-- ─────────────────────────────────────────────────────────────────────
-- 11. SETTINGS SEEDS  (salon_settings is key/value jsonb — no new columns)
-- ─────────────────────────────────────────────────────────────────────
insert into salon_settings (key, value) values
  ('super_admin_auth', '{"otp_ttl_minutes":5,"session_hours":6,"max_fails":5,"lockout_minutes":15}'),
  ('gst',              '{"enabled_default":false,"rate":18,"gstin":"","legal_name":"Tony & Guy Hopefarm"}'),
  ('incentive',        '{"default_pct":5}')
on conflict (key) do nothing;

-- ─────────────────────────────────────────────────────────────────────
-- 12. ANALYTICS VIEWS  (read-only; security invoker; service-role API only)
--     One row per money-earning line, normalized across service / product /
--     package-redemption so the dashboard filters + groups uniformly.
-- ─────────────────────────────────────────────────────────────────────
create or replace view v_sales_lines as
  select st.id as ticket_id, sti.id as line_id, st.sale_at::date as sale_date,
         'service'::text as revenue_kind, sti.category, sti.employee_id,
         st.payment_mode as payment_method, st.is_gst,
         (sti.charged_price - coalesce(sti.package_amount,0)) as revenue,
         sti.menu_price, 1 as service_count
  from service_sale_tickets st
  join service_sale_items sti on sti.ticket_id = st.id
  where st.status = 'final'
  union all
  select st.id, sti.id, st.sale_at::date, 'package_redemption', sti.category, sti.employee_id,
         st.payment_mode, st.is_gst, coalesce(sti.package_amount,0), sti.menu_price, 0
  from service_sale_tickets st
  join service_sale_items sti on sti.ticket_id = st.id
  where st.status = 'final' and coalesce(sti.package_amount,0) > 0
  union all
  select ps.id, ps.id, ps.sale_date, 'product', coalesce(ps.product_name,'product'), ps.employee_id,
         ps.payment_mode, ps.is_gst, ps.total_amount, (ps.menu_price * ps.quantity), 0
  from product_sales ps;

create or replace view v_revenue_daily as
  select sale_date, revenue_kind, sum(revenue) as revenue, sum(service_count) as service_count
  from v_sales_lines group by sale_date, revenue_kind;
