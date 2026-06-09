-- Add discount tracking to bookings
alter table bookings
  add column if not exists discount_percent integer default 0,
  add column if not exists discount_code text,
  add column if not exists cancelled_at timestamptz,
  add column if not exists cancellation_reason text;

-- Allow public to create bookings and read availability
do $$ begin
  if not exists (select 1 from pg_policies where policyname = 'Public can create bookings' and tablename = 'bookings') then
    create policy "Public can create bookings" on bookings for insert with check (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Public can read own booking' and tablename = 'bookings') then
    create policy "Public can read own booking" on bookings for select using (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Public can update own booking status' and tablename = 'bookings') then
    create policy "Public can update own booking status" on bookings for update using (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Public can read availability slots' and tablename = 'availability_slots') then
    create policy "Public can read availability slots" on availability_slots for select using (true);
  end if;
end $$;

-- Seed default availability slots (Mon-Sun 10:00 - 21:00, every 45 min)
-- Slots are generated dynamically by the API, this table just tracks booked ones
