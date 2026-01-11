alter table moderation_settings
  add column if not exists admin_phone_numbers text[] not null default '{}'::text[];
