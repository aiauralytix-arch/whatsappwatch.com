alter table moderation_groups
  add column if not exists subscription_price_inr integer not null default 299;

alter table moderation_groups
  add column if not exists subscription_status text not null default 'inactive';
