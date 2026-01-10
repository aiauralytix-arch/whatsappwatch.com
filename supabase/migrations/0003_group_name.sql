alter table moderation_groups
  add column if not exists group_name text;
