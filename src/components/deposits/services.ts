import { Bonus, Deposit, Player, PrismaClient, Role } from "@prisma/client";
import { DepositSSE } from "./sse";
import CONFIG, { COIN_TRANSFER_STATUS, DEPOSIT_STATUS } from "@/config";
import { DepositsDAO } from "@/db/deposits";
import {
  DepositRequest,
  SetDepositStatusRequest,
} from "@/types/request/transfers";
import { PlainPlayerResponse, RoledPlayer } from "@/types/response/players";
import { HttpService } from "@/services/http.service";
import { AlqMovementResponse } from "@/types/response/alquimia";
import { ResourceService } from "@/services/resource.service";
import { BanxicoService } from "@/services/banxico.service";
import { Telegram } from "@/notification/telegram";
import { NotFoundException } from "@/helpers/error";
import { FullDeposit } from "@/types/services/deposits";

export class DepositServices extends ResourceService {
  constructor() {
    super(DepositsDAO);
  }

  /**
   * Create and verify deposit.
   */
  async create(player: PlainPlayerResponse, request: DepositRequest) {
    await DepositsDAO.authorizeCreation(request);

    this.notifyDepositCreation(player, request);

    const deposit = await DepositsDAO.create({
      data: {
        ...request,
        Player: { connect: { id: player.id } },
        CoinTransfer: { create: { status: COIN_TRANSFER_STATUS.PENDING } },
        status: DEPOSIT_STATUS.PENDING,
      },
    });

    return await this.verify(deposit);
  }

  /**
   * Update and verify an existing deposit
   */
  async update(
    player: RoledPlayer,
    deposit_id: string,
    request: DepositRequest,
  ): Promise<FullDeposit> {
    const deposit = await DepositsDAO._getById(deposit_id);
    if (!deposit) throw new NotFoundException("Deposit not found");

    if (deposit.status === DEPOSIT_STATUS.VERIFIED) return deposit;

    await DepositsDAO.authorizeUpdate(
      deposit_id,
      player,
      request.tracking_number,
    );

    const updated = await DepositsDAO.update({
      where: { id: deposit_id },
      data: request,
    });

    return await this.verify(updated);
  }

  async setStatus(
    agent: Player & { roles: Role[] },
    deposit_id: string,
    request: SetDepositStatusRequest,
  ): Promise<Deposit & { Player: Player }> {
    await DepositsDAO.authorizeUpdate(deposit_id, agent);

    // @ts-ignore
    return await DepositsDAO.update({
      where: { id: deposit_id },
      data: { ...request, dirty: false },
      include: { Player: true },
    });
  }

  async verify(
    deposit: Deposit,
  ): Promise<Deposit & { Player: Player & { Bonus: Bonus | null } }> {
    const amount = await this.verifyThroughBanxico(deposit);
    let result;

    if (amount) {
      result = await this.markAsVerified(deposit, amount);
    } else {
      result = await this.markAsUnverified(deposit);
    }

    this.notifyDepositVerification(result);

    return result;
  }

  /**
   * Verify receipt of Player's deposit through Alquimia.
   */
  public async verifyThroughAlquimia(
    deposit: Deposit,
  ): Promise<number | undefined> {
    if (deposit.status === DEPOSIT_STATUS.VERIFIED) return deposit.amount!;

    try {
      const alqDeposit = await this.alquimiaDepositLookup(
        deposit.tracking_number,
      );

      if (alqDeposit) return alqDeposit.valor_real;

      return;
    } catch (e) {
      if (CONFIG.LOG.LEVEL === "debug") console.error(e);
      return;
    }
  }

  /**
   * Find a deposit in Alquimia's database by tracking number
   */
  private async alquimiaDepositLookup(
    tracking_number: string,
  ): Promise<AlqMovementResponse | undefined> {
    const accountId = CONFIG.EXTERNAL.ALQ_SAVINGS_ACCOUNT_ID;
    const endpoint = `cuenta-ahorro-cliente/${accountId}/transaccion`;

    const httpService = new HttpService();
    const movements = await httpService.authedAlqApi.get<AlqMovementResponse[]>(
      `${endpoint}?clave_rastreo=${tracking_number}`,
    );

    if (movements.data.length === 0) return;
    return movements.data.find((movement) => movement.valor_real > 0);
  }

  /**
   * Verify receipt of Player's deposit through Banxico.
   * @returns number (verified deposit amount) | undefined if not verified
   */
  public async verifyThroughBanxico(
    deposit: Deposit,
  ): Promise<number | undefined> {
    if (deposit.status === DEPOSIT_STATUS.VERIFIED) return deposit.amount!;

    const banxicoService = new BanxicoService();

    if (deposit.sending_bank === "-1") {
      const bank = await banxicoService.findBank(deposit);
      if (!bank) return;

      deposit = await DepositsDAO.update({
        where: { id: deposit.id },
        data: { sending_bank: bank },
      });
    }

    try {
      return await banxicoService.verifyDeposit(deposit);
    } catch (e) {
      if (CONFIG.LOG.LEVEL === "debug") console.error(e);
      return;
    }
  }

  private notifyDepositCreation(player: Player, deposit: DepositRequest) {
    return Telegram.arturito(
      "*Nuevo deposito* de usuario " +
        player.username +
        " por una cantidad de " +
        deposit.amount +
        " " +
        player.balance_currency +
        "\n\n" +
        "Número de seguimiento: " +
        deposit.tracking_number,
    );
  }

  private dispatchSSE(deposit: Deposit) {
    const { DEPOSIT_EVENT, eventTarget } = DepositSSE;
    const customEvent = new CustomEvent(DEPOSIT_EVENT, {
      detail: { [deposit.id]: deposit.status },
    });
    eventTarget.dispatchEvent(customEvent);
  }

  private notifyDepositVerification(deposit: Deposit) {
    this.dispatchSSE(deposit);

    const result =
      deposit.status === DEPOSIT_STATUS.VERIFIED
        ? "*verificado*"
        : "*no verificado*";

    return Telegram.arturito(
      `Depósito Nº ${deposit.tracking_number} ${result}`,
    );
  }

  private markAsVerified(deposit: Deposit, amount: number) {
    const prisma = new PrismaClient();
    return prisma.deposit.update({
      where: { id: deposit.id },
      data: {
        status: DEPOSIT_STATUS.VERIFIED,
        amount,
        dirty: false,
      },
      include: { Player: { include: { Bonus: true } } },
    });
  }

  private markAsUnverified(deposit: Deposit) {
    const prisma = new PrismaClient();
    return prisma.deposit.update({
      where: { id: deposit.id },
      data: {
        dirty: false,
        status: DEPOSIT_STATUS.UNVERIFIED,
      },
      include: { Player: { include: { Bonus: true } } },
    });
  }

  /**
   * Show deposits which have pending actions
   */
  static async showPending(player_id: string): Promise<Deposit[]> {
    const deposits = await DepositsDAO.getPending(player_id);

    return deposits;
  }
}
