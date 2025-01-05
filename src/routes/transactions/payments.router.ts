import { Router } from "express";
import { checkExact } from "express-validator";
import passport from "passport";
import { throwIfBadRequest } from "@/middlewares/requestErrorHandler";
import {
  isKeyOfPayment,
  validateCashoutRequest,
} from "@/components/payments/validator";
import { PaymentController } from "@/components/payments/controller";
import { requireAgentRole, requireUserRole } from "@/middlewares/auth";
import { validateResourceSearchRequest } from "@/components/players/validators";

const paymentsRouter = Router();

paymentsRouter.post(
  "/cashout",
  passport.authenticate("jwt", { session: false, failWithError: true }),
  requireUserRole,
  validateCashoutRequest(),
  checkExact(),
  throwIfBadRequest,
  PaymentController.create,
);

paymentsRouter.get(
  "/payment",
  passport.authenticate("jwt", { session: false, failWithError: true }),
  requireAgentRole,
  validateResourceSearchRequest(isKeyOfPayment),
  checkExact(),
  throwIfBadRequest,
  PaymentController.index,
);

export default paymentsRouter;
