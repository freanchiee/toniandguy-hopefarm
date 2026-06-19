create table if not exists salon_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);

alter table salon_settings enable row level security;

-- Seed default discount config
insert into salon_settings (key, value) values (
  'discounts',
  '{"weekday_min": 25, "weekday_max": 35, "weekend_min": 10, "weekend_max": 15}'
) on conflict (key) do nothing;
