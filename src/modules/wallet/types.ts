export type WalletTransactionType =
  | "topup"
  | "order_payment"
  | "refund"
  | "adjustment";

export type WalletTransactionStatus = "pending" | "success" | "failed";

export type WalletTransaction = {
  id: string;
  type: WalletTransactionType;
  amount: string;
  balanceAfter: string;
  status: WalletTransactionStatus;
  reference: string;
  description: string;
  createdAt: string;
};

export type Wallet = {
  id: string;
  userId: string;
  balance: string;
  currency: string;
  createdAt: string;
  updatedAt: string;
  recentTransactions?: WalletTransaction[];
};

export type WalletTransactionsResponse = {
  items: WalletTransaction[];
  total: number;
  limit: number;
  offset: number;
  next: number | null;
  previous: number | null;
};

export type WalletTopupResponse = {
  reference: string;
  amount: number;
  currency: string;
  authorization_url: string;
  access_code: string;
  transaction?: WalletTransaction;
};

export type WalletTopupVerifyResponse = {
  success: boolean;
  settled: boolean;
  message?: string;
  wallet?: Wallet;
  transaction?: WalletTransaction;
};
