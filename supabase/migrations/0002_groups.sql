create extension if not exists "pgcrypto";

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists moderation_groups (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references users (clerk_user_id) on delete cascade,
  group_link text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, group_link)
);

drop trigger if exists set_moderation_groups_updated_at on moderation_groups;
create trigger set_moderation_groups_updated_at
before update on moderation_groups
for each row
execute function set_updated_at();

alter table moderation_settings add column if not exists group_id uuid;
alter table moderation_settings drop constraint if exists moderation_settings_user_id_key;

insert into moderation_groups (user_id, group_link)
select ms.user_id, null
from moderation_settings ms
left join moderation_groups mg
  on mg.user_id = ms.user_id and mg.group_link is null
where mg.id is null;

update moderation_settings ms
set group_id = mg.id
from moderation_groups mg
where mg.user_id = ms.user_id
  and mg.group_link is null
  and ms.group_id is null;

alter table moderation_settings
  add constraint moderation_settings_group_id_fkey
  foreign key (group_id) references moderation_groups (id) on delete cascade;

alter table moderation_settings
  add constraint moderation_settings_group_id_key unique (group_id);

alter table moderation_settings
  alter column group_id set not null;
