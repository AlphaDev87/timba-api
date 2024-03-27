import { AlquimiaDeposit, Deposit, Payment, Player } from "@prisma/client";
import { AxiosResponse } from "axios";
import { TransactionsDAO } from "@/db/transactions";
import { CustomError } from "@/middlewares/errorHandler";
import { DepositsDAO } from "@/db/deposits";
import { HttpService } from "@/services/http.service";
import { UserRootDAO } from "@/db/user-root";
import { PlainPlayerResponse } from "@/types/response/players";
import { PaymentsDAO } from "@/db/payments";
import {
  CashoutRequest,
  TransferDetails,
  DepositRequest,
} from "@/types/request/transfers";
import { Transaction } from "@/types/response/transactions";
import { parseAlqMovement, parseTransferResult } from "@/utils/parser";
import { Notify } from "@/helpers/notification";
import CONFIG from "@/config";
import { CasinoTokenService } from "@/services/casino-token.service";
import { CoinTransferResult } from "@/types/response/transfers";
import { AlquimiaDepositDAO } from "@/db/alq-deposits";
import { AlqMovementResponse } from "@/types/response/alquimia";

/**
 * Services to be consumed by Player endpoints
 */
export class FinanceServices {
  /**
   * Create deposit, verify it, and transfer coins from agent to player.
   */
  async deposit(
    player: PlainPlayerResponse,
    request: DepositRequest,
  ): Promise<CoinTransferResult> {
    await DepositsDAO.authorizeCreation(request);

    const deposit = await this.createDeposit(player.id, request);

    return await this.finalizeTransfer(deposit, player);
  }

  /**
   * Player announces they have completed a pending deposit
   */
  async confirmDeposit(
    player: PlainPlayerResponse,
    deposit_id: string,
    request: DepositRequest,
  ): Promise<CoinTransferResult & { deposit: Deposit }> {
    await DepositsDAO.authorizeConfirmation(deposit_id, player.id);

    const deposit = (await DepositsDAO.update(deposit_id, request))!;

    return await this.finalizeTransfer(deposit, player);
  }

  /**
   * Send payment to player, transfer coins from player to agent and create a
   * pending payment.
   */
  async cashOut(
    player: PlainPlayerResponse,
    request: CashoutRequest,
  ): Promise<CoinTransferResult> {
    await TransactionsDAO.authorizeTransaction(request.bank_account, player.id);

    const transferResult = await this.transfer(
      "withdrawal",
      request,
      player.panel_id,
    );

    if (transferResult.status === CONFIG.SD.COIN_TRANSFER_STATUS.COMPLETED)
      this.createPayment(player.id, request);

    return transferResult;
  }

  private async finalizeTransfer(
    deposit: Deposit,
    player: Player,
  ): Promise<CoinTransferResult & { deposit: Deposit }> {
    const verifiedDeposit = await this.verifyPayment(deposit);

    if (verifiedDeposit.status !== CONFIG.SD.DEPOSIT_STATUS.CONFIRMED) {
      const result: CoinTransferResult = {
        status: CONFIG.SD.COIN_TRANSFER_STATUS.INCOMPLETE,
        error: "Deposito no confirmado",
      };
      return {
        ...result,
        deposit: verifiedDeposit,
      };
    }

    const coinTransferResult = await this.transfer(
      "deposit",
      verifiedDeposit,
      player.panel_id,
    );

    return {
      ...coinTransferResult,
      deposit: verifiedDeposit,
    };
  }

  async transfer(
    type: "deposit" | "withdrawal",
    data: CashoutRequest | Deposit,
    playerPanelId: number,
  ): Promise<CoinTransferResult> {
    const transferDetails = await this.generateTransferDetails(
      type,
      playerPanelId,
      data.amount!,
      data.currency,
    );

    const result = await this.panelTransfer(transferDetails);
    if (result.status === 201 && type === "deposit")
      await DepositsDAO.update((data as Deposit).id, {
        coins_transfered: new Date().toISOString(),
      });

    if (
      transferDetails.type === "deposit" &&
      result.data.code == "insuficient_balance"
    ) {
      const difference =
        transferDetails.amount - result.data.variables.balance_amount;
      await Notify.agent({
        title: "Fichas insuficientes",
        body: `Necesitas recargar ${difference} fichas para completar transferencias pendientes.`,
        tag: CONFIG.SD.INSUFICIENT_CREDITS,
      });
    }

    await this.logTransaction(result, transferDetails);
    return parseTransferResult(result, transferDetails.type);
  }

  private async panelTransfer(
    transferDetails: TransferDetails,
  ): Promise<AxiosResponse> {
    const { authedAgentApi } = new HttpService();
    const url = "/backoffice/transactions/";
    const result = await authedAgentApi.post(url, transferDetails);

    if (result.status !== 201 && result.status !== 400)
      throw new CustomError({
        code: "error_transferencia",
        status: result.status,
        description: "Error al transferir fichas", //result.data
      });

    return result;
  }

  /**
   * Log into Transaction History table
   */
  private async logTransaction(
    transfer: any,
    transferDetails: TransferDetails,
  ) {
    const transaction: Transaction = {
      sender_id: transferDetails.sender_id,
      recipient_id: transferDetails.recipient_id,
      amount: transferDetails.amount,
      date: new Date().toISOString(),
      status: CONFIG.SD.COIN_TRANSFER_STATUS.INCOMPLETE,
    };
    if (transfer.status === 201) {
      transaction.status = CONFIG.SD.COIN_TRANSFER_STATUS.COMPLETED;
    }
    await TransactionsDAO.logTransaction(transaction);
  }

  private async generateTransferDetails(
    type: "deposit" | "withdrawal",
    playerPanelId: number,
    amount: number,
    currency: string,
  ): Promise<TransferDetails> {
    let agent = await UserRootDAO.getAgent();

    if (!agent) {
      const casinoTokenService = new CasinoTokenService();
      await casinoTokenService.login();
      agent = await UserRootDAO.getAgent();
    }

    let recipient_id, sender_id;

    switch (type) {
      case "deposit":
        recipient_id = playerPanelId;
        sender_id = agent!.panel_id;
        break;
      case "withdrawal":
        recipient_id = agent!.panel_id;
        sender_id = playerPanelId;
        break;
    }

    return {
      recipient_id,
      sender_id,
      amount: amount,
      currency: currency,
      type,
    };
  }

  private async createDeposit(
    player_id: string,
    request: DepositRequest,
  ): Promise<Deposit> {
    return await DepositsDAO.create({
      ...request,
      player_id,
    });
  }

  private async createPayment(
    player_id: string,
    request: CashoutRequest,
  ): Promise<Payment> {
    return await PaymentsDAO.create({
      player_id,
      amount: request.amount,
      bank_account: request.bank_account,
      currency: request.currency,
    });
  }

  /**
   * Verify receipt of Player's payment.
   */
  public async verifyPayment(deposit: Deposit): Promise<Deposit> {
    const localDeposit = await AlquimiaDepositDAO.findByTrackingNumber(
      deposit.tracking_number,
    );

    if (localDeposit) return this.markDepositAsConfirmed(deposit, localDeposit);

    const alqMovement = await this.alquimiaDepositLookup(
      deposit.tracking_number,
      deposit.paid_at,
    );

    if (alqMovement) return this.markDepositAsConfirmed(deposit, alqMovement);

    await DepositsDAO.update(deposit.id, {
      dirty: false,
      status: CONFIG.SD.DEPOSIT_STATUS.REJECTED,
    });

    return deposit;
  }

  private markDepositAsConfirmed(
    deposit: Deposit,
    movement: AlquimiaDeposit | AlqMovementResponse,
  ) {
    return DepositsDAO.update(deposit.id, {
      status: CONFIG.SD.DEPOSIT_STATUS.CONFIRMED,
      dirty: false,
      amount: movement.valor_real,
    });
  }

  /**
   * Find a deposit in Alquimia's database by tracking number and date.
   */
  private async alquimiaDepositLookup(
    tracking_number: string,
    from: Date,
    // to?: Date,
    page = 1,
    round = 1,
  ): Promise<AlqMovementResponse | undefined> {
    const accountId = CONFIG.EXTERNAL.ALQ_SAVINGS_ACCOUNT_ID;
    const endpoint = `cuenta-ahorro-cliente/${accountId}/transaccion`;
    const PAGE_SIZE = 20;

    const lastMovement = await AlquimiaDepositDAO.findLatest();
    if (lastMovement) from = new Date(lastMovement.fecha_operacion);

    const searchParams = new URLSearchParams();
    const startDate = from.toISOString().split("T")[0];
    // const endDate = to?.toISOString().split("T")[0];
    searchParams.set("fecha_inicio", startDate);
    // endDate && searchParams.set("fecha_fin", endDate);
    searchParams.set("registros", `${PAGE_SIZE}`);
    searchParams.set("page", page.toString());

    const httpService = new HttpService();
    const movements: AxiosResponse = await httpService.authedAlqApi.get(
      endpoint + "?" + searchParams.toString(),
    );

    if (movements.data.length === 0) return;

    await this.syncMovements(movements.data);

    const found = (movements.data as AlqMovementResponse[]).find(
      (movement) => movement.clave_rastreo === tracking_number,
    );

    if (!found && movements.data.length === PAGE_SIZE)
      return await this.alquimiaDepositLookup(
        tracking_number,
        from,
        // undefined,
        page + 1,
        round,
      );

    // if (!found && movements.data.length < 20 && round === 1) {
    //   const dayInMliseconds = 60 * 60 * 24 * 1000;
    //   to = from;
    //   from = new Date(from.getTime() - dayInMliseconds);
    //   return await this.alquimiaDepositLookup(
    //     tracking_number,
    //     from,
    //     to,
    //     (page = 1),
    //     (round = 2),
    //   );
    // }
    return found;
  }

  /**
   * Sync Alquimia data into local DB
   */
  private syncMovements(movements: AlqMovementResponse[]) {
    // TODO
    // Chequear que tipo_operacion = 1 sean depósitos
    const deposits: AlquimiaDeposit[] = movements
      .filter((movement) => movement.tipo_operacion === 1)
      .map(parseAlqMovement);

    if (!deposits) return;

    return AlquimiaDepositDAO.createMany(deposits);
  }

  /**
   * Show deposits for which the money transfer hasn't been verified
   */
  static async showPendingDeposits(player_id: string): Promise<Deposit[]> {
    const deposits = await DepositsDAO.getPending(player_id);
    return deposits;
  }

  static async deleteDeposit(deposit_id: string, player_id: string) {
    await DepositsDAO.authorizeDeletion(deposit_id, player_id);
    await DepositsDAO.delete(deposit_id);
  }
}
