import { Cashier, Payment } from "@prisma/client";
import { AxiosResponse } from "axios";
import { AuthServices } from "../auth/services";
import { Credentials } from "@/types/request/players";
import { compare } from "@/utils/crypt";
import { PaymentsDAO } from "@/db/payments";
import {
  AgentBankAccount,
  BalanceResponse,
  SupportResponse,
} from "@/types/response/agent";
import { TokenPair } from "@/types/response/jwt";
import { HttpService } from "@/services/http.service";
import { UnauthorizedError } from "@/helpers/error";
import { PlayersDAO } from "@/db/players";
import CONFIG, { PAYMENT_STATUS } from "@/config";
import { ERR } from "@/config/errors";
import {
  AlqCuentaAhorroResponse,
  AlqStatusTx,
} from "@/types/response/alquimia";
import { CustomError } from "@/helpers/error/CustomError";
import { UserRootUpdatableProps } from "@/types/request/agent";
import { AlquimiaTransferService } from "@/services/alquimia-transfer.service";
import { AgentConfigDAO } from "@/db/agentConfig";

export class AgentServices {
  static async login(
    credentials: Credentials,
    user_agent: string,
  ): Promise<{ tokens: TokenPair }> {
    const { username, password } = credentials;
    const agent = await PlayersDAO.getByUsername(username);
    if (!agent) throw new CustomError(ERR.INVALID_CREDENTIALS);

    if (!agent.roles.some((r) => r.name === CONFIG.ROLES.AGENT))
      throw new UnauthorizedError("Solo agentes");

    const passwordCheck = await compare(password, agent?.password);
    if (username !== agent.username || !passwordCheck)
      throw new CustomError(ERR.INVALID_CREDENTIALS);

    const authServices = new AuthServices();
    const { tokens } = await authServices.tokens(agent.id, user_agent);
    return { tokens };
  }

  /**
   * Release requested payment into player's bank account
   */
  static async releasePayment(payment_id: string): Promise<Payment> {
    const payment = await PaymentsDAO.authorizeRelease(payment_id);
    try {
      const alquimiaTransferService = new AlquimiaTransferService(payment);
      const transferStatus: AlqStatusTx = await alquimiaTransferService.pay();

      const updated = await PaymentsDAO.update(payment_id, {
        status: transferStatus.estatus,
        dirty: false,
        alquimia_id: Number(transferStatus.id_transaccion),
      });

      return updated;
    } catch (e) {
      await PaymentsDAO.update(payment_id, { dirty: false });
      throw e;
    }
  }

  static async markPaymentAsPaid(payment_id: string): Promise<Payment> {
    await PaymentsDAO.authorizeRelease(payment_id);
    try {
      const updated = await PaymentsDAO.update(payment_id, {
        status: PAYMENT_STATUS.COMPLETED,
      });
      return updated;
    } catch (e) {
      await PaymentsDAO.update(payment_id, { dirty: false });
      throw e;
    }
  }

  static async getBankAccount(): Promise<AgentBankAccount | undefined> {
    const account = AgentConfigDAO.getBankAccount();
    return account;
  }

  static async updateBankAccount(
    bankAccount: AgentBankAccount,
  ): Promise<AgentBankAccount | null> {
    const config = await AgentConfigDAO.update({ bankAccount });
    return config.bankAccount as AgentBankAccount;
  }

  static async getCasinoBalance(agent: Cashier): Promise<BalanceResponse> {
    const url = "accounts/user";
    const httpService = new HttpService(agent);
    const response: AxiosResponse = await httpService.authedAgentApi.get(url);
    if (response.status !== 200)
      throw new CustomError({
        code: "agent_api_error",
        status: response.status,
        description: "Error en el panel al obtener el balance",
        detail: response.data,
      });
    return {
      balance: Number(response.data.balance),
    };
  }

  static async getAlqBalance(agent: Cashier): Promise<BalanceResponse> {
    const url = "cuenta-ahorro-cliente";
    const httpService = new HttpService(agent);
    const response: AxiosResponse = await httpService.authedAlqApi.get(url);
    if (response.status !== 200)
      throw new CustomError({
        code: "alquimia",
        status: response.status,
        description: "Error en alquimia al obtener el balance",
        detail: response.data,
      });
    const account = (response.data as AlqCuentaAhorroResponse).find(
      (account) =>
        account.id_cuenta_ahorro === CONFIG.EXTERNAL.ALQ_SAVINGS_ACCOUNT_ID,
    );
    if (!account) throw new CustomError(ERR.ALQ_ACCOUNT_NOT_FOUND);
    return {
      balance: Number(account.saldo_ahorro),
    };
  }

  static async getSupportNumbers(): Promise<SupportResponse> {
    const config = await AgentConfigDAO.getConfig();

    if (!config) throw new CustomError(ERR.AGENT_UNSET);

    return {
      bot_phone: config.bot_phone,
      human_phone: config.human_phone,
    };
  }

  static async updateSupportNumbers(
    data: UserRootUpdatableProps,
  ): Promise<SupportResponse> {
    const config = await AgentConfigDAO.update(data);

    return {
      bot_phone: config.bot_phone,
      human_phone: config.human_phone,
    };
  }
}
