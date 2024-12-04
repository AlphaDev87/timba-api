import { TimeWindow } from "@/components/analytics/validators";

export class ResourceService {
  constructor(private DAO: IDAO) {}

  async getAll<T>(
    page: number,
    itemsPerPage: number,
    search?: string,
    orderBy?: OrderBy,
    filters?: {
      source?: string;
      event?: string;
      window?: TimeWindow;
      windowPage?: number;
    },
  ): Promise<T[]> {
    const entities = await this.DAO._getAll(
      page,
      itemsPerPage,
      search,
      orderBy,
      filters,
    );

    return entities as T[];
  }

  async show<T>(id: string): Promise<T[] | null> {
    const entity = await this.DAO._getById(id);
    if (!entity) return null;
    return [entity as T];
  }
}

type OrderBy = {
  [key: string]: "asc" | "desc";
};

interface IDAO {
  _getAll(
    page: number,
    itemsPerPage: number,
    search?: string,
    orderBy?: OrderBy,
    filters?: {
      source?: string;
      event?: string;
      window?: TimeWindow;
      windowPage?: number;
    },
  ): Promise<{}[]>;

  _getById(id: string): Promise<{} | null>;
}
