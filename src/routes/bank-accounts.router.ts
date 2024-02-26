import { Router } from "express";
import { checkExact } from "express-validator";
import { BankAccountsController } from "@/components/bank-accounts/controller";
import {
  validateAccountUpdate,
  validateBankAccount,
  validateBankAccountIndex,
} from "@/components/bank-accounts/validators";
import { authenticatePlayer } from "@/components/players/validators";

const bankAccountsRouter = Router();

bankAccountsRouter.use(authenticatePlayer);
bankAccountsRouter.get(
  "/:id?",
  validateBankAccountIndex(),
  BankAccountsController.index,
);
bankAccountsRouter.post(
  "/",
  validateBankAccount(),
  checkExact(),
  BankAccountsController.create,
);
bankAccountsRouter.put(
  "/:id",
  validateAccountUpdate(),
  checkExact(),
  BankAccountsController.update,
);
bankAccountsRouter.delete(
  "/:id",
  validateBankAccountIndex(),
  BankAccountsController.delete,
);

export default bankAccountsRouter;
