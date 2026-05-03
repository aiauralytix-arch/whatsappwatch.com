import { supabase } from "@/lib/supabase";
import { INITIAL_FREE_WC_CREDITS } from "@/src/lib/billing/credit-packs";
import type {
  CreditLedgerRow,
  CreditWallet,
  CreditWalletRow,
} from "@/types/supabase";

const mapWalletRow = (row: CreditWalletRow): CreditWallet => ({
  id: row.id,
  userId: row.user_id,
  balance: row.balance,
  totalPurchased: row.total_purchased,
  totalSpent: row.total_spent,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const firstRow = <T>(data: T[] | T | null): T | null => {
  if (!data) return null;
  return Array.isArray(data) ? data[0] ?? null : data;
};

export const ensureCreditWallet = async (
  userId: string,
): Promise<CreditWallet> => {
  const { data, error } = await supabase.rpc("ensure_credit_wallet", {
    p_user_id: userId,
    p_initial_credits: INITIAL_FREE_WC_CREDITS,
  });

  const row = firstRow(data as CreditWalletRow[] | CreditWalletRow | null);

  if (error || !row) {
    throw new Error(
      `Failed to load WC credit wallet: ${error?.message ?? "No wallet row returned."}`,
    );
  }

  return mapWalletRow(row);
};

export const reserveMessageDeleteCredit = async (
  userId: string,
  whapiMessageId: string,
  metadata: Record<string, unknown>,
) => {
  const { data, error } = await supabase.rpc("charge_message_delete_credit", {
    p_user_id: userId,
    p_whapi_message_id: whapiMessageId,
    p_metadata: metadata,
  });

  const row = firstRow(
    data as
      | Array<{
          charged: boolean;
          insufficient_balance: boolean;
          duplicate: boolean;
          balance: number;
          ledger_id: string | null;
        }>
      | {
          charged: boolean;
          insufficient_balance: boolean;
          duplicate: boolean;
          balance: number;
          ledger_id: string | null;
        }
      | null,
  );

  if (error || !row) {
    throw new Error("Failed to reserve WC credit.");
  }

  return row;
};

export const refundMessageDeleteCredit = async (
  userId: string,
  whapiMessageId: string,
  metadata: Record<string, unknown>,
) => {
  const { data, error } = await supabase.rpc("refund_message_delete_credit", {
    p_user_id: userId,
    p_whapi_message_id: whapiMessageId,
    p_metadata: metadata,
  });

  const row = firstRow(
    data as
      | Array<{ refunded: boolean; balance: number; ledger_id: string | null }>
      | { refunded: boolean; balance: number; ledger_id: string | null }
      | null,
  );

  if (error || !row) {
    throw new Error("Failed to refund WC credit.");
  }

  return row;
};

export const addPurchasedCredits = async ({
  userId,
  credits,
  referenceId,
  metadata,
}: {
  userId: string;
  credits: number;
  referenceId: string;
  metadata: Record<string, unknown>;
}) => {
  const { data, error } = await supabase.rpc("add_purchased_credits", {
    p_user_id: userId,
    p_amount: credits,
    p_reference_type: "dodo_payment",
    p_reference_id: referenceId,
    p_metadata: metadata,
  });

  const row = firstRow(
    data as
      | Array<{ applied: boolean; balance: number; ledger_id: string | null }>
      | { applied: boolean; balance: number; ledger_id: string | null }
      | null,
  );

  if (error || !row) {
    throw new Error("Failed to add purchased WC credits.");
  }

  return row;
};

export const getRecentCreditLedger = async (
  userId: string,
  limit = 20,
): Promise<CreditLedgerRow[]> => {
  const { data, error } = await supabase
    .from("credit_ledger")
    .select(
      "id, user_id, wallet_id, type, amount, balance_after, reference_type, reference_id, metadata, created_at",
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error("Failed to load WC credit history.");
  }

  return data ?? [];
};
