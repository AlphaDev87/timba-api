import { Analytics, PrismaClient } from "@prisma/client";
import {
  subDays,
  startOfDay,
  startOfWeek,
  startOfMonth,
  endOfDay,
  subWeeks,
  endOfWeek,
  subMonths,
  endOfMonth,
  format,
} from "date-fns";
import { AnalyticsCreateRequest } from "@/types/request/analytics";
import { OrderBy } from "@/types/request/players";
import { TimeWindow } from "@/components/analytics/validators";

const prisma = new PrismaClient();

export class AnalyticsDAO {
  static get count() {
    try {
      return prisma.analytics.count();
    } catch (e) {
      throw e;
    } finally {
      prisma.$disconnect();
    }
  }
  static async _getAll(
    page: number,
    itemsPerPage: number,
    search?: string,
    orderBy?: OrderBy<Analytics>,
    filters?: {
      source?: string;
      event?: string;
      window?: TimeWindow;
      windowPage: number;
    },
  ) {
    try {
      const { source, event, window, windowPage } = filters || {};
      let dateRange;

      if (window) {
        dateRange = this.getDateRange(window, windowPage);
      }

      const whereClauses = [];

      if (search) {
        whereClauses.push(`
          (
            source LIKE '%${search}%' OR
            event LIKE '%${search}%' OR
            JSON_UNQUOTE(JSON_EXTRACT(data, '$')) LIKE '%${search}%'
          )
        `);
      }

      if (source) {
        whereClauses.push(`source = '${source}'`);
      }

      if (event) {
        whereClauses.push(`event = '${event}'`);
      }

      if (dateRange) {
        whereClauses.push(
          `created_at BETWEEN '${dateRange.startDate}' AND '${dateRange.endDate}'`,
        );
      }

      const whereSql =
        whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

      type OrderByFields =
        | "source"
        | "event"
        | "id"
        | "created_at"
        | "updated_at";

      let orderSql = "";
      if (orderBy) {
        const field = Object.keys(orderBy)[0] as OrderByFields;
        const direction = orderBy[field]; // 'asc' o 'desc'
        if (["asc", "desc"].includes(direction || "asc") && field) {
          orderSql = `ORDER BY ${field} ${direction}`;
        }
      }

      // Construcción completa de la consulta
      const query = `
        SELECT * FROM analytics
        ${whereSql}
        ${orderSql}
        LIMIT ${itemsPerPage} OFFSET ${page * itemsPerPage};
      `;

      const results = await prisma.$queryRawUnsafe<Analytics[]>(query);
      const parsedResults = results.map((item) => ({
        ...item,
        data: item.data ? JSON.parse(item.data as unknown as string) : null, // Parseo seguro
      }));

      return parsedResults;
    } catch (error) {
      throw error;
    } finally {
      prisma.$disconnect();
    }
  }

  static async _getById(id: string) {
    try {
      return await prisma.analytics.findUnique({ where: { id } });
    } catch (error) {
      throw error;
    } finally {
      prisma.$disconnect();
    }
  }

  static async create(data: AnalyticsCreateRequest) {
    try {
      return await prisma.analytics.create({ data });
    } catch (error) {
      throw error;
    } finally {
      prisma.$disconnect();
    }
  }

  static getDateRange(
    timeWindow: "day" | "week" | "month",
    windowPage = 0,
  ): {
    startDate: string;
    endDate: string;
  } {
    const now = new Date();
    let startDate: Date;
    let endDate: Date = now;

    switch (timeWindow) {
      case "day":
        startDate = startOfDay(subDays(now, windowPage));
        endDate = endOfDay(subDays(now, windowPage));
        break;

      case "week":
        const currentWeek = subWeeks(now, windowPage);
        startDate = startOfWeek(currentWeek, { weekStartsOn: 0 }); // Domingo como inicio de semana
        endDate = endOfWeek(currentWeek, { weekStartsOn: 0 });
        break;

      case "month":
        const currentMonth = subMonths(now, windowPage);
        startDate = startOfMonth(currentMonth);
        endDate = endOfMonth(currentMonth);
        break;

      default:
        throw new Error("Invalid window value");
    }
    return {
      startDate: format(startDate, "yyyy-MM-dd HH:mm:ss"),
      endDate: format(endDate, "yyyy-MM-dd HH:mm:ss"),
    };
  }
}
