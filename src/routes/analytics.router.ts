import { Router } from "express";
import { checkExact } from "express-validator";
import passport from "passport";
import { AnalyticsController } from "@/components/analytics/controller";
import { throwIfBadRequest } from "@/middlewares/requestErrorHandler";
import {
  isKeyOfAnalytics,
  validateAnalyticsRequest,
  validateId,
} from "@/components/analytics/validators";
import { validateResourceSearchRequest } from "@/components/analytics/validators";
import { requireAgentRole } from "@/middlewares/auth";

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
analyticsRouter.use(
  passport.authenticate("jwt", { session: false, failWithError: true }),
);
analyticsRouter.use(requireAgentRole);
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
