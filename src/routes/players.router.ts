import { Router } from "express";
import { checkExact } from "express-validator";
import passport from "passport";
import { PlayersController } from "@/components/players";
import {
  validateCredentials,
  validatePlayerRequest,
  validatePlayerSearchRequest,
  validatePlayerUpdateRequest,
} from "@/components/players/validators";
import { throwIfBadRequest } from "@/middlewares/requestErrorHandler";
import { requireAgentRole } from "@/middlewares/auth";
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
playersRouter.use(
  passport.authenticate("jwt", { session: false, failWithError: true }),
);
playersRouter.get("/:id", PlayersController.show);
playersRouter.use(requireAgentRole);
playersRouter.get(
  "/",
  validatePlayerSearchRequest(),
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
