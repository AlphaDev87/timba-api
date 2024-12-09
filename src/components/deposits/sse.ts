export class DepositSSE {
  static readonly eventTarget = new EventTarget();
  static readonly DEPOSIT_EVENT = "deposit";
  static readonly COIN_TRANSFER_EVENT = "coin-transfer";
}
