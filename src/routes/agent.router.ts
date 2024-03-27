import { Router } from "express";
import { checkExact } from "express-validator";
import passport from "passport";
import { AgentController } from "@/components/agent/controller";
import { validateCredentials } from "@/components/players/validators";
import {
  validateBankAccountUpdate,
  validatePaymentIndex,
} from "@/components/agent/validators";
import { throwIfBadRequest } from "@/middlewares/requestErrorHandler";
import { requireAgentRole } from "@/middlewares/auth";

const agentRouter = Router();

agentRouter.post(
  "/login",
  validateCredentials(),
  checkExact(),
  throwIfBadRequest,
  AgentController.login,
);
agentRouter.use(
  passport.authenticate("jwt", { session: false, failWithError: true }),
);
agentRouter.use(requireAgentRole);
agentRouter.get("/payments", AgentController.showPayments);
agentRouter.post(
  "/payments/:id/paid",
  validatePaymentIndex(),
  checkExact(),
  throwIfBadRequest,
  AgentController.markAsPaid,
);
agentRouter.get("/deposits", AgentController.showDeposits);
agentRouter.get("/qr", AgentController.qr);
agentRouter.get("/bank-account", AgentController.getBankAccount);
agentRouter.post(
  "/bank-account",
  validateBankAccountUpdate(),
  checkExact(),
  throwIfBadRequest,
  AgentController.updateBankAccount,
);
agentRouter.get("/balance", AgentController.getBalance);
agentRouter.get("/deposits/complete", AgentController.completePendingDeposits);

export default agentRouter;
