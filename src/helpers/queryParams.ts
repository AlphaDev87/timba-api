export const extractResourceSearchQueryParams = <T>(req: Req) => {
  const page = Number(req.query.page) - 1;
  const itemsPerPage = Number(req.query.items_per_page) ?? 20;
  const search = req.query.search as string;
  const sortColumn = req.query.sort_column as keyof T;
  const sortDirection = req.query.sort_direction as SortDirection;

  return { page, itemsPerPage, search, sortColumn, sortDirection };
};
