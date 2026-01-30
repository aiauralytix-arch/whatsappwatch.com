alter table moderation_settings
  add column if not exists block_videos boolean not null default false;
