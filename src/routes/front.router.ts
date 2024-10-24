import { Router } from "express";

const frontRouter = Router();

frontRouter.get("/", (_req: Req, res: Res, _next: NextFn) =>
  res.status(301).setHeader("Location", "https://casino-mex.com").send(),
);

export default frontRouter;
