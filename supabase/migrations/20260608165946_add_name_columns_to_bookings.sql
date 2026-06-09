-- Store human-readable names on bookings so we don't depend on FK joins
-- (the form sends names, not UUIDs, so FKs were silently rejecting inserts)
alter table bookings
  add column if not exists service_name text,
  add column if not exists stylist_name text;
