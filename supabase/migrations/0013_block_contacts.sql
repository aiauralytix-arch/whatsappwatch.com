alter table moderation_settings
  add column if not exists block_contacts boolean not null default false;
