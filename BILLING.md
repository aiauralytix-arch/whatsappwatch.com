# Billing: WC Credits

WhatsApp Watch uses prepaid internal credits for message deletion billing.
Dodo Payments collects money. Supabase stores the internal wallet and ledger.
Whapi message moderation spends credits only when a message is actually deleted.

## Product Rules

- Internal currency name: WC credits.
- New users receive 20 free WC credits when their wallet is first created.
- Credits never expire.
- There is only one credit type.
- 1 WC credit = 1 successfully deleted WhatsApp message.
- If a user has 0 credits, spam can still be detected, but messages are not deleted.
- Failed Whapi deletes do not cost credits.
- Purchased credits are INR-only for v1.

## Tables

### `credit_wallets`

One row per Clerk user.

Used for fast balance checks:

- `user_id`: Clerk user ID.
- `balance`: current available WC credits.
- `total_purchased`: lifetime purchased credits.
- `total_spent`: lifetime spent credits.

### `credit_ledger`

Append-only credit audit log.

Every balance movement should create a ledger row:

- `grant`: initial 20 free credits.
- `purchase`: Dodo payment credited the wallet.
- `deduction`: 1 credit reserved/spent for a Whapi delete.
- `adjustment`: refund or manual correction.

`reference_type + reference_id` is unique when both are present. This prevents
duplicate payment credits and duplicate message-delete charges.

### `billing_events`

Stores processed Dodo webhook IDs.

Dodo can retry webhook delivery. This table prevents the same webhook event from
being processed more than once.

## Static Credit Packs

Credit packs are static in the repo, not stored in Supabase:

[src/lib/billing/credit-packs.ts](src/lib/billing/credit-packs.ts)

Current packs:

- Testing: ₹10 for 10 credits. Only visible on `/pricing?testing`.
- Starter: ₹199 for 250 credits.
- Growth: ₹499 for 750 credits.
- Pro: ₹999 for 2,000 credits.
- Power: ₹2,499 for 6,000 credits.

Each pack maps to a Dodo product ID through env vars:

```bash
DODO_WC_TESTING_PRODUCT_ID=...
DODO_WC_STARTER_PRODUCT_ID=...
DODO_WC_GROWTH_PRODUCT_ID=...
DODO_WC_PRO_PRODUCT_ID=...
DODO_WC_POWER_PRODUCT_ID=...
```

## Dodo Payment Flow

Checkout creation starts from:

[src/actions/billing/credits.actions.ts](src/actions/billing/credits.actions.ts)

Then:

1. User clicks Buy Credits on `/pricing`.
2. App calls `createWcCreditCheckout(packId)`.
3. Server creates a Dodo checkout session.
4. Dodo redirects the browser back to:

```txt
${NEXT_PUBLIC_APP_URL}/dashboard?billing=return
```

or:

```txt
${NEXT_PUBLIC_APP_URL}/dashboard?billing=cancelled
```

The redirect alone does not add credits. Credits are added only by the Dodo
webhook.

## Dodo Webhook Flow

Webhook route:

[app/api/dodo/webhook/route.ts](app/api/dodo/webhook/route.ts)

Local Dodo webhook URL with ngrok:

```txt
https://your-ngrok-url.ngrok-free.app/api/dodo/webhook
```

Production Dodo webhook URL:

```txt
https://whatsappwatch.com/api/dodo/webhook
```

Flow:

1. Dodo sends a webhook to `/api/dodo/webhook`.
2. App verifies:
   - `webhook-id`
   - `webhook-signature`
   - `webhook-timestamp`
3. App inserts the event into `billing_events`.
4. If event is `payment.succeeded`, app reads Dodo metadata:
   - `clerk_user_id`
   - `pack_id`
5. App calls `add_purchased_credits(...)`.
6. Supabase increments `credit_wallets.balance`.
7. Supabase writes a `purchase` row in `credit_ledger`.

The Dodo webhook is separate from the browser redirect. The browser can return
to `/dashboard` before the webhook finishes.

## Whapi Delete Billing Flow

Whapi moderation route:

[app/api/whapi/webhook/route.ts](app/api/whapi/webhook/route.ts)

Core service:

[src/services/moderation/whapi-webhook.service.ts](src/services/moderation/whapi-webhook.service.ts)

Local Whapi webhook URL with ngrok:

```txt
https://your-ngrok-url.ngrok-free.app/api/whapi/webhook
```

Flow:

1. Whapi sends message payload to `/api/whapi/webhook`.
2. App extracts supported message types.
3. App finds the verified moderation group by `verified_whapi_group_id`.
4. App evaluates configured moderation rules.
5. If message is spam and sender is not allowlisted:
   - app calls `reserveMessageDeleteCredit(...)`.
   - Supabase runs `charge_message_delete_credit(...)`.
6. If credit was reserved:
   - app calls Whapi `DELETE /messages/{messageId}`.
7. If Whapi delete succeeds:
   - charge stays.
   - app stores row in `moderation_deleted_messages`.
8. If Whapi delete fails:
   - app calls `refundMessageDeleteCredit(...)`.
   - Supabase gives the credit back.

The app reserves the credit before deleting to prevent overspending when two
spam messages arrive at the same time and the user has a low balance.

## Important Debugging Notes

Dashboard logs like this are not Whapi moderation logs:

```txt
POST /dashboard?billing=cancelled 200
POST /dashboard?billing=return 200
```

Those are dashboard/server-action requests.

For message deletion billing, the terminal should show:

```txt
POST /api/whapi/webhook 200
```

If you do not see `/api/whapi/webhook`, Whapi is not calling the local app that
you are watching in the terminal.

## Useful SQL Checks

Check wallet:

```sql
select *
from credit_wallets
where user_id = 'CLERK_USER_ID';
```

Check if a message was charged:

```sql
select *
from credit_ledger
where reference_type = 'whapi_message_delete'
  and reference_id = 'WHAPI_MESSAGE_ID';
```

Check recent credit activity:

```sql
select *
from credit_ledger
where user_id = 'CLERK_USER_ID'
order by created_at desc;
```

Check which user owned a deleted message:

```sql
select d.whapi_message_id, d.user_id, d.group_id, g.user_id as group_owner
from moderation_deleted_messages d
left join moderation_groups g on g.id = d.group_id
where d.whapi_message_id = 'WHAPI_MESSAGE_ID';
```

Manually test credit deduction:

```sql
select *
from charge_message_delete_credit(
  'CLERK_USER_ID',
  'manual_test_message_id',
  '{"manual_test": true}'::jsonb
);
```

Refund the manual test:

```sql
select *
from refund_message_delete_credit(
  'CLERK_USER_ID',
  'manual_test_message_id',
  '{"manual_test": true}'::jsonb
);
```

## Required Env Vars

```bash
DODO_PAYMENTS_API_KEY=...
DODO_PAYMENTS_WEBHOOK_SECRET=...
DODO_PAYMENTS_API_BASE_URL=https://test.dodopayments.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
DODO_WC_TESTING_PRODUCT_ID=...
DODO_WC_STARTER_PRODUCT_ID=...
DODO_WC_GROWTH_PRODUCT_ID=...
DODO_WC_PRO_PRODUCT_ID=...
DODO_WC_POWER_PRODUCT_ID=...
```

For local Dodo webhook testing, keep `NEXT_PUBLIC_APP_URL` as your dashboard
redirect URL. Configure the Dodo dashboard webhook URL separately as:

```txt
https://your-ngrok-url.ngrok-free.app/api/dodo/webhook
```
