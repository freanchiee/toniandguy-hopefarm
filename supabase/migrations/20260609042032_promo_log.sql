create table if not exists promo_log (
  id          uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id),
  phone       text not null,
  message     text,
  sent        boolean default false,
  created_at  timestamptz default now()
);

alter table promo_log enable row level security;
create policy "Service role full access on promo_log"
  on promo_log for all using (true);
