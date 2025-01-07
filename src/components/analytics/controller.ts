import { CREATED, OK } from "http-status";
import { Analytics } from "@prisma/client";
import { AgentServices } from "../agent/services";
import { CashierServices } from "../cashier/services";
import { AnalyticsServices } from "./services";
import { TimeWindow } from "./validators";
import { apiResponse } from "@/helpers/apiResponse";
import { AnalyticsDAO } from "@/db/analytics";
import { AnalyticsCreateRequest } from "@/types/request/analytics";
import { extractResourceSearchQueryParams } from "@/helpers/queryParams";

export class AnalyticsController {
  static async index(req: Req, res: Res, next: NextFn) {
    try {
      const { page, itemsPerPage, search, orderBy } =
        extractResourceSearchQueryParams<Analytics>(req);

      const filters = {
        source: req.query.source as string,
        event: req.query.event as string,
        window: req.query.window as TimeWindow,
        windowPage: parseInt((req.query.windowPage as string) || "0", 10),
      };

      const analyticsServices = new AnalyticsServices();
      const result = await analyticsServices.getAll(
        page,
        itemsPerPage,
        search,
        orderBy,
        filters,
      );
      const total = await AnalyticsDAO.count;

      res.status(OK).send(apiResponse({ result, total }));
    } catch (e) {
      next(e);
    }
  }

  static async show(req: Req, res: Res, next: NextFn) {
    try {
      const analyticsServices = new AnalyticsServices();
      const analytics = await analyticsServices.show<Analytics>(req.params.id);

      res.status(OK).send(apiResponse(analytics));
    } catch (e) {
      next(e);
    }
  }

  static async create(req: Req, res: Res, next: NextFn) {
    try {
      const data: AnalyticsCreateRequest = req.body;
      const analytics = await AnalyticsDAO.create(data);

      res.status(CREATED).send(apiResponse(analytics));
    } catch (e) {
      next(e);
    }
  }

  static async summary(req: Req, res: Res, next: NextFn) {
    try {
      const agent = req.user!;
      const { window } = req.body;
      const validWindows = ["day", "week", "month"];
      const cashierServices = new CashierServices();
      const analyticsServices = new AnalyticsServices();

      const range = analyticsServices.getDateRange(window);
      const report = await cashierServices.playerGeneralReport(
        agent.id,
        {
          date_from: range.startDate.toISOString(),
          date_to: range.endDate.toISOString(),
        },
        agent.Cashier!,
      );
      let netwin = 0;
      if (report?.total?.total_wins) {
        netwin = parseFloat(parseFloat(report?.total?.total_wins).toFixed(2));
      }

      const { balance } = await AgentServices.getCasinoBalance(agent.Cashier!);

      const summary = await analyticsServices.summary(
        window && validWindows.includes(window) ? window : "day",
      );

      const eventList = await analyticsServices.eventList();
      res.status(OK).send(
        apiResponse({
          eventList,
          eventCount: summary,
          netwin,
          balance: !balance && isNaN(balance) ? 0 : balance,
        }),
      );
    } catch (e) {
      next(e);
    }
  }
}
