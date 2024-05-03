import { Player, Payment } from "@prisma/client";
import { ERR } from "@/config/errors";
import { PaymentsDAO } from "@/db/payments";
import { CustomError } from "@/helpers/error/CustomError";
import { CasinoCoinsService } from "@/services/casino-coins.service";
import { CashoutRequest } from "@/types/request/transfers";
import { PlainPlayerResponse } from "@/types/response/players";
import { CoinTransferResult } from "@/types/response/transfers";

export class PaymentServices {
  /**
   * Send payment to player, transfer coins from player to agent and create a
   * pending payment.
   */
  async create(
    player: PlainPlayerResponse,
    request: CashoutRequest,
  ): Promise<CoinTransferResult> {
    await PaymentsDAO.authorizeCreation(request.bank_account, player.id);
    const casinoCoinsService = new CasinoCoinsService();
    let transferResult: CoinTransferResult | undefined;
    try {
      transferResult = await casinoCoinsService.playerToAgent(request, player);

      if (transferResult.ok) this.createDbObject(player, request);
      return transferResult;
    } catch (e) {
      if (
        e instanceof CustomError &&
        e.code === ERR.TRANSACTION_LOG.code &&
        transferResult?.ok
      ) {
        this.createDbObject(player, request);
        return transferResult;
      }
      throw e;
    }
  }

  private async createDbObject(
    player: Player,
    request: CashoutRequest,
  ): Promise<Payment> {
    return await PaymentsDAO.create({
      player_id: player.id,
      amount: request.amount,
      bank_account: request.bank_account,
      currency: player.balance_currency,
    });
  }
}
