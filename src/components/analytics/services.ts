import { PrismaClient } from "@prisma/client";
import { subDays, startOfWeek, startOfMonth } from "date-fns";
import { AnalyticsDAO } from "@/db/analytics";
import { ResourceService } from "@/services/resource.service";
import { AnalyticsSummary } from "@/types/response/analytics";

export class AnalyticsServices extends ResourceService {
  constructor() {
    super(AnalyticsDAO);
  }

  async summary(
    timeWindow: "day" | "week" | "month",
  ): Promise<AnalyticsSummary> {
    const prisma = new PrismaClient();
    const range = this.getDateRange(timeWindow);

    const result = await prisma.analytics.groupBy({
      by: ["source", "event"],
      _count: {
        event: true,
      },
      where: {
        created_at: {
          gte: range.startDate,
          lte: range.endDate,
        },
      },
    });

    const formattedResult = result.reduce<AnalyticsSummary>((acc, item) => {
      if (!acc[item.source]) {
        acc[item.source] = {};
      }
      acc[item.source][item.event] = {
        count: item._count.event,
      };
      return acc;
    }, {});

    return formattedResult;
  }

  getDateRange(timeWindow: "day" | "week" | "month"): {
    startDate: Date;
    endDate: Date;
  } {
    const now = new Date();
    if (timeWindow === "day") {
      return { startDate: subDays(now, 1), endDate: now };
    }
    if (timeWindow === "week") {
      return { startDate: startOfWeek(now), endDate: now };
    }
    if (timeWindow === "month") {
      return { startDate: startOfMonth(now), endDate: now };
    }
    throw new Error("Invalid time window");
  }
}
