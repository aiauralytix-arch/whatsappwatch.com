create table if not exists moderation_defaults (
  id uuid primary key default gen_random_uuid(),
  user_id text not null unique references users (clerk_user_id) on delete cascade,
  blocked_keywords text[] not null default '{}'::text[],
  admin_phone_numbers text[] not null default '{}'::text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_moderation_defaults_updated_at on moderation_defaults;
create trigger set_moderation_defaults_updated_at
before update on moderation_defaults
for each row
execute function set_updated_at();
