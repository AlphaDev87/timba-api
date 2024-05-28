import { OK } from "http-status";
import { Deposit, Player } from "@prisma/client";
import { DepositServices } from "./services";
import { DepositsDAO } from "@/db/deposits";
import { apiResponse } from "@/helpers/apiResponse";
import { DepositRequest } from "@/types/request/transfers";
import { DepositResult } from "@/types/response/transfers";
import { extractResourceSearchQueryParams } from "@/helpers/queryParams";

export class DepositController {
  static readonly index = async (req: Req, res: Res, next: NextFn) => {
    try {
      const { page, itemsPerPage, search, sortColumn, sortDirection } =
        extractResourceSearchQueryParams<Deposit>(req);

      const depositServices = new DepositServices();
      const deposits = await depositServices.getAll<
        Deposit & { Player: Player }
      >(page, itemsPerPage, search, {
        [sortColumn]: sortDirection,
      });
      const totalDeposits = await DepositsDAO.count;

      res.status(OK).json(apiResponse({ deposits, totalDeposits }));
    } catch (err) {
      next(err);
    }
  };

  static readonly show = async (req: Req, res: Res, next: NextFn) => {
    const depositId = req.params.id;
    try {
      const depositServices = new DepositServices();
      const deposit = await depositServices.show(depositId);

      res.status(OK).json(apiResponse(deposit));
    } catch (err) {
      next(err);
    }
  };
  /**
   * Create new deposit or verify existing
   */
  static readonly create = async (req: Req, res: Res, next: NextFn) => {
    const deposit_id = req.params.id;
    const request: Omit<DepositRequest, "player_id"> = req.body;
    const player = req.user!;

    const depositServices = new DepositServices();
    try {
      let result: DepositResult;
      const deposit = await DepositsDAO.getByTrackingNumber(
        request.tracking_number,
      );
      if (deposit && !deposit_id) {
        result = await depositServices.confirm(player, deposit.id, request);
      } else if (!deposit && !deposit_id) {
        result = await depositServices.create(player, request);
      } else {
        result = await depositServices.confirm(player, deposit_id, request);
      }

      res.status(OK).json(apiResponse(result));
    } catch (e) {
      next(e);
    }
  };

  /**
   * Show pending deposits
   * @param req
   * @param res
   * @param next
   */
  static readonly pending = async (req: Req, res: Res, next: NextFn) => {
    const player = req.user!;

    try {
      const deposits = await DepositServices.showPending(player.id);
      res.status(OK).json(apiResponse(deposits));
    } catch (err) {
      next(err);
    }
  };
}
