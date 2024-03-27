/** Datos que recibe nuestra API */
export type CashoutRequest = {
  amount: number;
  currency: string;
  bank_account: string;
};

/** Datos para API del casino */
export type TransferDetails = {
  recipient_id: number;
  sender_id: number;
  amount: number;
  currency: string;
  type: "deposit" | "withdrawal";
};

export interface DepositRequest {
  currency: string;
  tracking_number: string;
  paid_at: string;
}

export interface CreateDepositProps extends DepositRequest {
  player_id: string;
}

export interface DepositUpdatableProps {
  player_id?: string;
  dirty?: boolean;
  status?: string;
  tracking_number?: string;
  coins_transfered?: string;
  paid_at?: string;
  amount?: number;
}

export interface PaymentRequest {
  player_id: string;
  bank_account: string;
  amount: number;
  currency: string;
}

export interface PaymentUpdatableProps {
  bank_account?: string;
  amount?: number;
  currency?: string;
  paid?: string;
}
