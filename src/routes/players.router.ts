import { Router } from "express";
import { checkExact } from "express-validator";
import passport from "passport";
import { PlayersController } from "@/components/players";
import {
  isKeyOfPlayer,
  validateCredentials,
  validateDepositRequest,
  validatePlayerRequest,
  validatePlayerUpdateRequest,
  validateResourceSearchRequest,
} from "@/components/players/validators";
import { throwIfBadRequest } from "@/middlewares/requestErrorHandler";
import { apiKeyAuthentication, requireAgentRole } from "@/middlewares/auth";
import { AgentController } from "@/components/agent";
import { DepositController } from "@/components/deposits/controller";
import { depositRateLimiter } from "@/middlewares/rate-limiters/deposit";
const playersRouter = Router();

playersRouter.post(
  "/",
  validatePlayerRequest(),
  checkExact(),
  throwIfBadRequest,
  PlayersController.create,
);
playersRouter.post(
  "/login",
  validateCredentials(),
  checkExact(),
  throwIfBadRequest,
  PlayersController.login,
);
playersRouter.get("/support", AgentController.getSupportNumbers);
playersRouter.post(
  "/:player_id/deposit/:deposit_id?",
  apiKeyAuthentication,
  validateDepositRequest(),
  checkExact(),
  throwIfBadRequest,
  depositRateLimiter,
  DepositController.upsert,
);
playersRouter.use(
  passport.authenticate("jwt", { session: false, failWithError: true }),
);
playersRouter.get("/:id", PlayersController.show);
playersRouter.get("/:id/balance", PlayersController.getBalance);
playersRouter.get("/:id/bonus", PlayersController.getBonus);
playersRouter.use(requireAgentRole);
playersRouter.get(
  "/",
  validateResourceSearchRequest(isKeyOfPlayer),
  checkExact(),
  throwIfBadRequest,
  PlayersController.index,
);
playersRouter.post(
  "/:id",
  validatePlayerUpdateRequest(),
  checkExact(),
  throwIfBadRequest,
  PlayersController.update,
);

export default playersRouter;
