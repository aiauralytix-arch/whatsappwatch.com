create table if not exists moderation_deleted_messages (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references users (clerk_user_id) on delete cascade,
  group_id uuid references moderation_groups (id) on delete cascade,
  whapi_group_id text not null,
  whapi_message_id text not null,
  sender_id text,
  sender_key text,
  message_text text not null,
  message_timestamp timestamptz,
  matched_keywords text[] not null default '{}'::text[],
  has_url boolean not null default false,
  has_number boolean not null default false,
  spam_triggered boolean not null default false,
  created_at timestamptz not null default now()
);

create unique index if not exists moderation_deleted_messages_whapi_message_id_key
  on moderation_deleted_messages (whapi_message_id);

create index if not exists moderation_deleted_messages_group_id_created_at_idx
  on moderation_deleted_messages (group_id, created_at desc);
