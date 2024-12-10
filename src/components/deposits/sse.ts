import { DepositEvent, CoinTransferEvent } from "@/types/response/sse";

export class DepositSSE {
  static readonly eventTarget = new EventTarget();
  static readonly DEPOSIT_EVENT = "deposit";
  static readonly COIN_TRANSFER_EVENT = "coin-transfer";

  get eventTarget() {
    return DepositSSE.eventTarget;
  }
  get DEPOSIT_EVENT() {
    return DepositSSE.DEPOSIT_EVENT;
  }
  get COIN_TRANSFER_EVENT() {
    return DepositSSE.COIN_TRANSFER_EVENT;
  }

  constructor(
    private res: Res,
    private userId: string,
    private isAgent: boolean,
  ) {
    this.eventTarget.addEventListener(this.DEPOSIT_EVENT, this.depositListener);
    this.eventTarget.addEventListener(
      this.COIN_TRANSFER_EVENT,
      this.coinTransferListener,
    );
  }

  sendEvent(e: CustomEvent<DepositEvent | CoinTransferEvent>, type: string) {
    const { detail } = e;

    if (detail.userId === this.userId || this.isAgent) {
      this.res.write(`event: ${type}\n`);
      this.res.write(`data: ${JSON.stringify(detail)}\n\n`);
    }
  }

  depositListener: EventListener = (e) =>
    this.sendEvent(e as CustomEvent<DepositEvent>, DepositSSE.DEPOSIT_EVENT);

  coinTransferListener: EventListener = (e) =>
    this.sendEvent(
      e as CustomEvent<CoinTransferEvent>,
      DepositSSE.COIN_TRANSFER_EVENT,
    );

  dismantle() {
    this.eventTarget.removeEventListener(
      this.DEPOSIT_EVENT,
      this.depositListener,
    );
    this.eventTarget.removeEventListener(
      this.COIN_TRANSFER_EVENT,
      this.coinTransferListener,
    );
  }
}
