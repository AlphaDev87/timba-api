export type DepositEvent = {
  depositId: string;
  userId: string;
};

export type CoinTransferEvent = {
  coinTransferId: string;
  userId: string;
};

export type SSEAuthentication = {
  userId: string;
  isAgent: boolean;
  jwt?: string;
};
