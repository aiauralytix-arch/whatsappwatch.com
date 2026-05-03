-- Fixes the applied 0016 function without editing the old migration.
-- In PL/pgSQL, the returned column named user_id can make
-- `on conflict (user_id)` ambiguous, so use the table constraint name.
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
  on conflict on constraint credit_wallets_user_id_key do nothing;

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
  select
    cw.id,
    cw.user_id,
    cw.balance,
    cw.total_purchased,
    cw.total_spent,
    cw.created_at,
    cw.updated_at
  from credit_wallets cw
  where cw.user_id = p_user_id;
end;
$$;
