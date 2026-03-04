-- =============================================
-- MomzVeda Database Setup
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- =============================================

-- 1. PROFILES TABLE
create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  mom_name text,
  mom_age text,
  country text,
  parenting_style text,
  challenges jsonb default '[]'::jsonb,
  support_system text,
  onboarded boolean default false,
  is_premium boolean default false,
  updated_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert with check (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);


-- 2. CHILDREN TABLE
create table if not exists children (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  age text,
  notes text default '',
  created_at timestamptz default now()
);

alter table children enable row level security;

create policy "Users can view own children"
  on children for select using (auth.uid() = user_id);

create policy "Users can insert own children"
  on children for insert with check (auth.uid() = user_id);

create policy "Users can update own children"
  on children for update using (auth.uid() = user_id);

create policy "Users can delete own children"
  on children for delete using (auth.uid() = user_id);


-- 3. MESSAGES TABLE
create table if not exists messages (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz default now()
);

alter table messages enable row level security;

create policy "Users can view own messages"
  on messages for select using (auth.uid() = user_id);

create policy "Users can insert own messages"
  on messages for insert with check (auth.uid() = user_id);


-- 4. MOM_WINS TABLE
create table if not exists mom_wins (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  text text not null,
  date text,
  created_at timestamptz default now()
);

alter table mom_wins enable row level security;

create policy "Users can view own wins"
  on mom_wins for select using (auth.uid() = user_id);

create policy "Users can insert own wins"
  on mom_wins for insert with check (auth.uid() = user_id);

create policy "Users can delete own wins"
  on mom_wins for delete using (auth.uid() = user_id);


-- 5. DAILY_USAGE TABLE
create table if not exists daily_usage (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  date text not null,
  msg_count integer default 0,
  created_at timestamptz default now(),
  unique(user_id, date)
);

alter table daily_usage enable row level security;

create policy "Users can view own usage"
  on daily_usage for select using (auth.uid() = user_id);

create policy "Users can insert own usage"
  on daily_usage for insert with check (auth.uid() = user_id);

create policy "Users can update own usage"
  on daily_usage for update using (auth.uid() = user_id);


-- 6. AUTO-CREATE PROFILE ON SIGNUP (trigger)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists then recreate
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
