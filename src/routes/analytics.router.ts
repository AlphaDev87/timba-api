import { Router } from "express";
import { checkExact } from "express-validator";
import { AnalyticsController } from "@/components/analytics/controller";
import { throwIfBadRequest } from "@/middlewares/requestErrorHandler";
import {
  isKeyOfAnalytics,
  validateAnalyticsRequest,
  validateId,
} from "@/components/analytics/validators";
import { validateResourceSearchRequest } from "@/components/analytics/validators";

const analyticsRouter = Router();

// TODO
// Create user with analytics role and enforce authentication
analyticsRouter.get(
  "/",
  validateResourceSearchRequest(isKeyOfAnalytics),
  checkExact(),
  throwIfBadRequest,
  AnalyticsController.index,
);
analyticsRouter.post("/summary", AnalyticsController.summary);
analyticsRouter.get(
  "/:id",
  validateId(),
  checkExact(),
  throwIfBadRequest,
  AnalyticsController.show,
);
analyticsRouter.post(
  "/",
  validateAnalyticsRequest(),
  checkExact(),
  throwIfBadRequest,
  AnalyticsController.create,
);

export default analyticsRouter;
