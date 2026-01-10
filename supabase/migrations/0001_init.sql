create extension if not exists "pgcrypto";

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null unique,
  email text,
  name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists moderation_settings (
  id uuid primary key default gen_random_uuid(),
  user_id text not null unique references users (clerk_user_id) on delete cascade,
  block_phone_numbers boolean not null default false,
  block_links boolean not null default false,
  block_keywords boolean not null default false,
  spam_protection_enabled boolean not null default false,
  blocked_keywords text[] not null default '{}'::text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_users_updated_at on users;
create trigger set_users_updated_at
before update on users
for each row
execute function set_updated_at();

drop trigger if exists set_moderation_settings_updated_at on moderation_settings;
create trigger set_moderation_settings_updated_at
before update on moderation_settings
for each row
execute function set_updated_at();
