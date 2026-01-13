alter table moderation_settings
  rename column admin_phone_numbers to allowlist_phone_numbers;

alter table moderation_defaults
  rename column admin_phone_numbers to allowlist_phone_numbers;
