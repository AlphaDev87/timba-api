export type AnalyticsSummary = {
  [source: string]: {
    [event: string]: {
      count: number;
    };
  };
};
