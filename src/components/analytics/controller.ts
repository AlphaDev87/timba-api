import { CREATED, OK } from "http-status";
import { Analytics } from "@prisma/client";
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
      const { window } = req.body;
      const validWindows = ["day", "week", "month"];

      const analyticsServices = new AnalyticsServices();

      const summary = await analyticsServices.summary(
        window && validWindows.includes(window) ? window : "day",
      );

      res.status(OK).send(
        apiResponse({
          eventCount: summary,
          netwin: 27000,
          balance: 12500,
        }),
      );
    } catch (e) {
      next(e);
    }
  }
}
