-- Anonymous analytics for the AI Style Match feature.
-- NO image, NO PII — only the aggregate signal the salon cares about.
create table if not exists face_analyses (
  id uuid primary key default gen_random_uuid(),
  gender text not null,
  face_shape text not null,
  confidence text,
  created_at timestamptz default now()
);

alter table face_analyses enable row level security;
-- Writes happen only via the service-role key (server route), which bypasses RLS.
-- No public policies => not readable/writable by anon/authenticated. Defense in depth.
