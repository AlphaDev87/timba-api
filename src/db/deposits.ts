import { Deposit, PrismaClient } from "@prisma/client";
import {
  CreateDepositProps,
  DepositRequest,
  DepositUpdatableProps,
} from "@/types/request/transfers";
import { ForbiddenError, NotFoundException } from "@/helpers/error";
import { hidePassword } from "@/utils/auth";
import CONFIG from "@/config";

const prisma = new PrismaClient();

export class DepositsDAO {
  /**
   * Create a DB entry for a deposit
   */
  static create(data: CreateDepositProps): Promise<Deposit> {
    try {
      return prisma.deposit.create({
        data: { ...data, status: CONFIG.SD.DEPOSIT_STATUS.PENDING },
        // include: { Player: true },
      });
    } catch (error) {
      throw error;
    } finally {
      prisma.$disconnect();
    }
  }

  static async index(all = true) {
    try {
      const deposits = await prisma.deposit.findMany({
        where: all
          ? {}
          : {
              OR: [
                { status: CONFIG.SD.DEPOSIT_STATUS.PENDING },
                { status: CONFIG.SD.DEPOSIT_STATUS.VERIFIED },
              ],
            },
        include: { Player: true },
      });

      deposits.forEach(
        (deposit) => (deposit.Player = hidePassword(deposit.Player)),
      );
      return deposits;
    } catch (error) {
      throw error;
    } finally {
      prisma.$disconnect();
    }
  }

  static getById(id: string) {
    try {
      return prisma.deposit.findUnique({
        where: { id },
        include: { Player: true },
      });
    } catch (error) {
      throw error;
    } finally {
      prisma.$disconnect();
    }
  }

  static getByTrackingNumber(tracking_number: string) {
    try {
      return prisma.deposit.findUnique({
        where: { tracking_number },
      });
    } catch (error) {
      throw error;
    } finally {
      prisma.$disconnect();
    }
  }

  // TODO test
  static getPending(player_id: string) {
    try {
      return prisma.deposit.findMany({
        where: {
          player_id,
          AND: {
            OR: [
              { status: CONFIG.SD.DEPOSIT_STATUS.PENDING },
              { status: CONFIG.SD.DEPOSIT_STATUS.VERIFIED },
            ],
          },
        },
      });
    } catch (error) {
      throw error;
    } finally {
      prisma.$disconnect();
    }
  }

  /**
   * Get deposits where the money has been confirmed to have arrived at
   * Alquimia but coins haven't been transfered yet.
   */
  static getPendingCoinTransfers() {
    try {
      return prisma.deposit.findMany({
        where: {
          status: CONFIG.SD.DEPOSIT_STATUS.VERIFIED,
        },
        include: { Player: true },
      });
    } catch (error) {
      throw error;
    } finally {
      prisma.$disconnect();
    }
  }

  static update(id: string, data: DepositUpdatableProps) {
    try {
      return prisma.deposit.update({ where: { id }, data });
    } catch (error) {
      throw error;
    } finally {
      prisma.$disconnect();
    }
  }

  static delete(id: string) {
    try {
      return prisma.deposit.delete({ where: { id } });
    } catch (error) {
      throw error;
    } finally {
      prisma.$disconnect();
    }
  }

  /**
   * Ensures deposit exists and belongs to player.
   * @throws if checks fail.
   */
  static async authorizeTransaction(deposit_id: string, player_id: string) {
    try {
      const deposit = await this.getById(deposit_id);
      if (!deposit) throw new NotFoundException();

      if (deposit.player_id !== player_id)
        throw new ForbiddenError("No autorizado");

      return deposit;
    } catch (error) {
      throw error;
    } finally {
      prisma.$disconnect();
    }
  }

  /**
   * Checks if:
   *  - deposit exists and belongs to player
   *  - deposit is not completed or deleted
   *  - deposit is not being confirmed (dirty)
   *
   * If checks pass, sets dirty flag to true (deposit is being confirmed)
   * @throws if checks fail
   */
  static async authorizeConfirmation(deposit_id: string, player_id: string) {
    try {
      let deposit = await this.authorizeTransaction(deposit_id, player_id);
      if (deposit.status === CONFIG.SD.DEPOSIT_STATUS.COMPLETED)
        throw new ForbiddenError(
          "No se pueden modificar depositos completados",
        );
      if (deposit.status === CONFIG.SD.DEPOSIT_STATUS.DELETED)
        throw new ForbiddenError("No se pueden modificar depositos eliminados");
      if (deposit.dirty)
        throw new ForbiddenError("El deposito esta siendo confirmado");

      deposit = await prisma.deposit.update({
        where: { id: deposit_id },
        data: { dirty: true },
        include: { Player: true },
      });
      return deposit;
    } catch (error) {
      throw error;
    } finally {
      prisma.$disconnect();
    }
  }

  static authorizeDeletion = this.authorizeConfirmation;

  static async authorizeCreation(request: DepositRequest) {
    try {
      const deposit = await prisma.deposit.findUnique({
        where: { tracking_number: request.tracking_number },
      });
      if (deposit) throw new ForbiddenError("already exists");
      return deposit;
    } catch (error) {
      throw error;
    } finally {
      prisma.$disconnect();
    }
  }
}
