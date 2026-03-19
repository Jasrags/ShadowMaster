import type { ContactStatus, FavorTransactionType } from "@/lib/types";

export interface StatusStyle {
  readonly bg: string;
  readonly text: string;
  readonly border: string;
}

export const STATUS_STYLES: Readonly<Record<ContactStatus, StatusStyle>> = {
  active: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/30",
  },
  burned: {
    bg: "bg-red-500/10",
    text: "text-red-400",
    border: "border-red-500/30",
  },
  inactive: {
    bg: "bg-zinc-500/10",
    text: "text-zinc-400",
    border: "border-zinc-500/30",
  },
  missing: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/30",
  },
  deceased: {
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/30",
  },
};

export interface TransactionTypeLabel {
  readonly label: string;
  readonly color: string;
}

export const TRANSACTION_TYPE_LABELS: Readonly<Record<FavorTransactionType, TransactionTypeLabel>> =
  {
    favor_called: { label: "Favor Called", color: "text-blue-400" },
    favor_failed: { label: "Favor Failed", color: "text-red-400" },
    favor_granted: { label: "Favor Granted", color: "text-emerald-400" },
    favor_owed: { label: "Favor Owed", color: "text-amber-400" },
    favor_repaid: { label: "Favor Repaid", color: "text-emerald-400" },
    loyalty_change: { label: "Loyalty Change", color: "text-pink-400" },
    connection_change: { label: "Connection Change", color: "text-cyan-400" },
    contact_burned: { label: "Contact Burned", color: "text-red-400" },
    contact_acquired: { label: "Contact Acquired", color: "text-emerald-400" },
    contact_reactivated: { label: "Contact Reactivated", color: "text-blue-400" },
    status_change: { label: "Status Changed", color: "text-purple-400" },
    gift: { label: "Gift Given", color: "text-amber-400" },
    betrayal: { label: "Betrayal", color: "text-red-400" },
    reputation_effect: { label: "Reputation Effect", color: "text-orange-400" },
    chip_spent_dice_bonus: { label: "Chips for Dice", color: "text-cyan-400" },
    chip_spent_loyalty: { label: "Chips for Loyalty", color: "text-pink-400" },
  };

export function getFavorBalanceStyle(balance: number): {
  readonly color: string;
  readonly text: string;
} {
  if (balance > 0) {
    return { color: "text-emerald-400", text: `+${balance} owed to you` };
  }
  if (balance < 0) {
    return { color: "text-amber-400", text: `${Math.abs(balance)} owed by you` };
  }
  return { color: "text-muted-foreground", text: "Even" };
}
