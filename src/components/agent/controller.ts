import { join } from "path";
import { createReadStream } from "fs";
import { OK } from "http-status";
import { AgentServices } from "./services";
import { Credentials } from "@/types/request/players";
import { apiResponse } from "@/helpers/apiResponse";
import { AgentBankAccount } from "@/types/response/agent";

export class AgentController {
  static async login(req: Req, res: Res, next: NextFn) {
    try {
      const credentials: Credentials = req.body;
      const user_agent = req.headers["user-agent"];

      const token = await AgentServices.login(credentials, user_agent);

      res.status(OK).json(apiResponse({ access: token }));
    } catch (error) {
      next(error);
    }
  }

  static async showPayments(_req: Req, res: Res, next: NextFn) {
    try {
      const payments = await AgentServices.showPayments();

      res.status(OK).json(apiResponse(payments));
    } catch (error) {
      next(error);
    }
  }

  static async markAsPaid(req: Req, res: Res, next: NextFn) {
    try {
      const { id } = req.params;

      const payment = await AgentServices.markAsPaid(id);

      res.status(OK).json(apiResponse(payment));
    } catch (error) {
      next(error);
    }
  }

  static async showDeposits(req: Req, res: Res, next: NextFn) {
    try {
      const depositId = req.params.id;
      const deposits = await AgentServices.showDeposits(depositId);

      res.status(OK).json(apiResponse(deposits));
    } catch (error) {
      next(error);
    }
  }

  static async qr(_req: Req, res: Res, next: NextFn) {
    try {
      const PATH_QR = join(process.cwd(), `bot.qr.png`);
      const fileStream = createReadStream(PATH_QR);

      res.writeHead(200, { "Content-Type": "image/png" });
      fileStream.pipe(res);
    } catch (error) {
      next(error);
    }
  }

  static async getBankAccount(_req: Req, res: Res, next: NextFn) {
    try {
      const bankAccount = await AgentServices.getBankAccount();

      res.status(OK).json(apiResponse(bankAccount));
    } catch (error) {
      next(error);
    }
  }

  static async updateBankAccount(req: Req, res: Res, next: NextFn) {
    try {
      const data: AgentBankAccount = req.body;

      const bankAccount = await AgentServices.updateBankAccount(data);

      res.status(OK).json(apiResponse(bankAccount));
    } catch (error) {
      next(error);
    }
  }

  static async getBalance(_req: Req, res: Res, next: NextFn) {
    try {
      const balance = await AgentServices.getBalance();

      res.status(OK).json(apiResponse(balance));
    } catch (error) {
      next(error);
    }
  }

  static async completePendingDeposits(_req: Req, res: Res, next: NextFn) {
    try {
      const deposits = await AgentServices.freePendingCoinTransfers();

      res.status(OK).json(apiResponse(deposits));
    } catch (error) {
      next(error);
    }
  }
}
