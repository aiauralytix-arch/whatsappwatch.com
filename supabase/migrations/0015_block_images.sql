alter table moderation_settings
  add column if not exists block_images boolean not null default false;
