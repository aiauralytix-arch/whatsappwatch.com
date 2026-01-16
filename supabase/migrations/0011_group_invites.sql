alter table moderation_settings
  add column if not exists block_group_invites boolean not null default false;
