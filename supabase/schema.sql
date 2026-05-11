-- Personal Tracker Schema
-- Run this in your Supabase SQL editor (https://app.supabase.com)

-- Tasks
create table if not exists tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text,
  status text default 'todo' check (status in ('todo', 'in-progress', 'done')),
  priority text default 'medium' check (priority in ('low', 'medium', 'high')),
  due_date date,
  category text,
  created_at timestamptz default now()
);

-- Finances
create table if not exists finances (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  type text not null check (type in ('income', 'expense')),
  amount decimal(12, 2) not null,
  category text not null,
  description text,
  date date not null,
  created_at timestamptz default now()
);

-- Health logs
create table if not exists health_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  type text not null,
  value numeric,
  unit text,
  notes text,
  date date not null,
  created_at timestamptz default now()
);

-- Goals
create table if not exists goals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text,
  category text,
  target_date date,
  progress integer default 0 check (progress >= 0 and progress <= 100),
  status text default 'active' check (status in ('active', 'completed', 'paused')),
  milestones jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table tasks enable row level security;
alter table finances enable row level security;
alter table health_logs enable row level security;
alter table goals enable row level security;

-- RLS policies: users can only access their own rows
create policy "Users own their tasks"
  on tasks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users own their finances"
  on finances for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users own their health_logs"
  on health_logs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users own their goals"
  on goals for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
