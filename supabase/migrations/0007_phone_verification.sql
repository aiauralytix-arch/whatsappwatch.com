alter table users
  add column if not exists phone_number text,
  add column if not exists phone_verified_at timestamptz;

create table if not exists phone_verifications (
  id uuid primary key default gen_random_uuid(),
  user_id text not null unique references users (clerk_user_id) on delete cascade,
  phone_number text not null,
  otp_hash text not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_phone_verifications_updated_at on phone_verifications;
create trigger set_phone_verifications_updated_at
before update on phone_verifications
for each row
execute function set_updated_at();
