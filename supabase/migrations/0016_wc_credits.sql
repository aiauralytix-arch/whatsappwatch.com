-- One wallet per Clerk user. This is the fast balance lookup used before
-- attempting paid moderation actions.
create table if not exists credit_wallets (
  id uuid primary key default gen_random_uuid(),
  user_id text not null unique references users (clerk_user_id) on delete cascade,
  balance integer not null default 0 check (balance >= 0),
  total_purchased integer not null default 0 check (total_purchased >= 0),
  total_spent integer not null default 0 check (total_spent >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Append-only credit history. Every grant, purchase, deduction, and correction
-- should have a row here so balances can be audited later.
create table if not exists credit_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references users (clerk_user_id) on delete cascade,
  wallet_id uuid not null references credit_wallets (id) on delete cascade,
  type text not null check (type in ('grant', 'purchase', 'deduction', 'adjustment')),
  amount integer not null,
  balance_after integer not null check (balance_after >= 0),
  reference_type text,
  reference_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Prevents duplicate processing for external actions such as a Dodo payment or
-- a Whapi message delete. Null references are allowed for manual adjustments.
create unique index if not exists credit_ledger_reference_key
  on credit_ledger (reference_type, reference_id)
  where reference_type is not null and reference_id is not null;

create index if not exists credit_ledger_user_created_at_idx
  on credit_ledger (user_id, created_at desc);

-- Stores Dodo webhook deliveries that have already been handled. Dodo retries
-- webhooks, so this table prevents duplicate credit grants.
create table if not exists billing_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null default 'dodo',
  provider_event_id text not null,
  event_type text not null,
  payload jsonb not null,
  processed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (provider, provider_event_id)
);

drop trigger if exists set_credit_wallets_updated_at on credit_wallets;
create trigger set_credit_wallets_updated_at
before update on credit_wallets
for each row
execute function set_updated_at();

-- Creates a wallet if needed and gives the one-time free WC credit grant.
-- The unique ledger reference means calling this repeatedly is safe.
create or replace function ensure_credit_wallet(
  p_user_id text,
  p_initial_credits integer default 20
)
returns table (
  id uuid,
  user_id text,
  balance integer,
  total_purchased integer,
  total_spent integer,
  created_at timestamptz,
  updated_at timestamptz
)
language plpgsql
as $$
declare
  v_wallet credit_wallets%rowtype;
  v_balance_after integer;
begin
  insert into credit_wallets (user_id)
  values (p_user_id)
  on conflict (user_id) do nothing;

  select *
  into v_wallet
  from credit_wallets cw
  where cw.user_id = p_user_id
  for update;

  insert into credit_ledger (
    user_id,
    wallet_id,
    type,
    amount,
    balance_after,
    reference_type,
    reference_id,
    metadata
  )
  values (
    p_user_id,
    v_wallet.id,
    'grant',
    p_initial_credits,
    v_wallet.balance + p_initial_credits,
    'initial_grant',
    p_user_id,
    jsonb_build_object('reason', 'new_user_free_wc_credits')
  )
  on conflict do nothing;

  if found then
    update credit_wallets cw
    set balance = cw.balance + p_initial_credits
    where cw.id = v_wallet.id
    returning cw.balance into v_balance_after;
  end if;

  return query
  select cw.id, cw.user_id, cw.balance, cw.total_purchased, cw.total_spent, cw.created_at, cw.updated_at
  from credit_wallets cw
  where cw.user_id = p_user_id;
end;
$$;

-- Adds credits after a successful Dodo payment. The reference should be the
-- Dodo payment id so a retried webhook cannot credit the wallet twice.
create or replace function add_purchased_credits(
  p_user_id text,
  p_amount integer,
  p_reference_type text,
  p_reference_id text,
  p_metadata jsonb default '{}'::jsonb
)
returns table (
  applied boolean,
  balance integer,
  ledger_id uuid
)
language plpgsql
as $$
declare
  v_wallet credit_wallets%rowtype;
  v_ledger_id uuid;
  v_balance_after integer;
begin
  perform ensure_credit_wallet(p_user_id);

  select *
  into v_wallet
  from credit_wallets cw
  where cw.user_id = p_user_id
  for update;

  select cl.id
  into v_ledger_id
  from credit_ledger cl
  where cl.reference_type = p_reference_type
    and cl.reference_id = p_reference_id;

  if v_ledger_id is not null then
    return query select false, v_wallet.balance, v_ledger_id;
    return;
  end if;

  update credit_wallets cw
  set
    balance = cw.balance + p_amount,
    total_purchased = cw.total_purchased + p_amount
  where cw.id = v_wallet.id
  returning cw.balance into v_balance_after;

  insert into credit_ledger (
    user_id,
    wallet_id,
    type,
    amount,
    balance_after,
    reference_type,
    reference_id,
    metadata
  )
  values (
    p_user_id,
    v_wallet.id,
    'purchase',
    p_amount,
    v_balance_after,
    p_reference_type,
    p_reference_id,
    coalesce(p_metadata, '{}'::jsonb)
  )
  returning id into v_ledger_id;

  return query select true, v_balance_after, v_ledger_id;
end;
$$;

-- Reserves 1 WC credit before calling Whapi delete. Reserving first prevents
-- concurrent webhook messages from overspending a low balance.
create or replace function charge_message_delete_credit(
  p_user_id text,
  p_whapi_message_id text,
  p_metadata jsonb default '{}'::jsonb
)
returns table (
  charged boolean,
  insufficient_balance boolean,
  duplicate boolean,
  balance integer,
  ledger_id uuid
)
language plpgsql
as $$
declare
  v_wallet credit_wallets%rowtype;
  v_ledger_id uuid;
  v_balance_after integer;
begin
  perform ensure_credit_wallet(p_user_id);

  select *
  into v_wallet
  from credit_wallets cw
  where cw.user_id = p_user_id
  for update;

  select cl.id
  into v_ledger_id
  from credit_ledger cl
  where cl.reference_type = 'whapi_message_delete'
    and cl.reference_id = p_whapi_message_id;

  if v_ledger_id is not null then
    return query select false, false, true, v_wallet.balance, v_ledger_id;
    return;
  end if;

  if v_wallet.balance <= 0 then
    return query select false, true, false, v_wallet.balance, null::uuid;
    return;
  end if;

  update credit_wallets cw
  set
    balance = cw.balance - 1,
    total_spent = cw.total_spent + 1
  where cw.id = v_wallet.id
  returning cw.balance into v_balance_after;

  insert into credit_ledger (
    user_id,
    wallet_id,
    type,
    amount,
    balance_after,
    reference_type,
    reference_id,
    metadata
  )
  values (
    p_user_id,
    v_wallet.id,
    'deduction',
    -1,
    v_balance_after,
    'whapi_message_delete',
    p_whapi_message_id,
    coalesce(p_metadata, '{}'::jsonb)
  )
  returning id into v_ledger_id;

  return query select true, false, false, v_balance_after, v_ledger_id;
end;
$$;

-- Gives back the reserved credit when Whapi delete fails. This keeps the user
-- from paying for failed deletes while preserving the original audit trail.
create or replace function refund_message_delete_credit(
  p_user_id text,
  p_whapi_message_id text,
  p_metadata jsonb default '{}'::jsonb
)
returns table (
  refunded boolean,
  balance integer,
  ledger_id uuid
)
language plpgsql
as $$
declare
  v_wallet credit_wallets%rowtype;
  v_charge_id uuid;
  v_refund_id uuid;
  v_balance_after integer;
begin
  select *
  into v_wallet
  from credit_wallets cw
  where cw.user_id = p_user_id
  for update;

  if v_wallet.id is null then
    return query select false, 0, null::uuid;
    return;
  end if;

  select cl.id
  into v_charge_id
  from credit_ledger cl
  where cl.user_id = p_user_id
    and cl.reference_type = 'whapi_message_delete'
    and cl.reference_id = p_whapi_message_id
    and cl.type = 'deduction';

  if v_charge_id is null then
    return query select false, v_wallet.balance, null::uuid;
    return;
  end if;

  select cl.id
  into v_refund_id
  from credit_ledger cl
  where cl.user_id = p_user_id
    and cl.reference_type = 'whapi_message_delete_refund'
    and cl.reference_id = p_whapi_message_id;

  if v_refund_id is not null then
    return query select false, v_wallet.balance, v_refund_id;
    return;
  end if;

  update credit_wallets cw
  set
    balance = cw.balance + 1,
    total_spent = greatest(cw.total_spent - 1, 0)
  where cw.id = v_wallet.id
  returning cw.balance into v_balance_after;

  insert into credit_ledger (
    user_id,
    wallet_id,
    type,
    amount,
    balance_after,
    reference_type,
    reference_id,
    metadata
  )
  values (
    p_user_id,
    v_wallet.id,
    'adjustment',
    1,
    v_balance_after,
    'whapi_message_delete_refund',
    p_whapi_message_id,
    coalesce(p_metadata, '{}'::jsonb)
  )
  returning id into v_refund_id;

  return query select true, v_balance_after, v_refund_id;
end;
$$;
