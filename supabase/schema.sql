-- Edu Alt Tech certificate verification - Supabase schema
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor > New query)

create table if not exists public.certificates (
  id text primary key,
  name text not null,
  type text not null check (type in ('employee', 'internship')),
  issue_date text not null,
  description text not null default '',
  image text not null,
  created_at timestamptz not null default now()
);

insert into public.certificates (id, name, type, issue_date, description, image)
values
  ('EAT-EMP-001', 'Kavya Sri Vankayala', 'employee', '2026-06-01', 'Employee certificate of appreciation for outstanding contribution to Edu Alt Tech.', '/certificates/kavya.png'),
  ('EAT-EMP-002', 'Yuva Raj', 'employee', '2026-06-01', 'Employee certificate of appreciation for outstanding contribution to Edu Alt Tech.', '/certificates/yuva.png'),
  ('EAT-INT-001', 'Karthik', 'internship', '2026-05-15', 'Internship certificate for successfully completing the internship program at Edu Alt Tech.', '/certificates/karthik.png')
on conflict (id) do nothing;

-- Row Level Security: anonymous users can read, only the service role can write
alter table public.certificates enable row level security;

drop policy if exists "certificates read for all" on public.certificates;
create policy "certificates read for all" on public.certificates
  for select using (true);
