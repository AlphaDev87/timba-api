import { Router } from "express";
import { checkExact } from "express-validator";
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
  requireUserRole,
  validateCashoutRequest(),
  checkExact(),
  throwIfBadRequest,
  PaymentController.create,
);
paymentsRouter.use(requireAgentRole);
paymentsRouter.get(
  "/payment",
  validateResourceSearchRequest(isKeyOfPayment),
  checkExact(),
  throwIfBadRequest,
  PaymentController.index,
);

export default paymentsRouter;
