import { Deposit } from "@prisma/client";
import { checkSchema } from "express-validator";

export const isKeyOfDeposit = (key: string): key is keyof Deposit => {
  const mockDeposit: Deposit = {
    id: "",
    amount: 0,
    currency: "",
    dirty: false,
    player_id: "",
    status: "",
    tracking_number: "",
    created_at: new Date(),
    updated_at: new Date(),
  };
  return key in mockDeposit;
};

export const validateDepositRequest = () =>
  checkSchema({
    id: {
      in: ["params"],
      optional: true,
    },
    tracking_number: {
      in: ["body"],
      isEmpty: false,
      isString: true,
      errorMessage: "tracking_number is required",
    },
  });

export const validateDepositId = () =>
  checkSchema({
    id: {
      in: ["params"],
      isString: true,
      isNumeric: false,
      isEmpty: false,
    },
  });

export const validateDepositIndex = () =>
  checkSchema({
    id: {
      in: ["params"],
      isString: true,
      optional: true,
    },
  });

export const validateDepositUpdate = () =>
  checkSchema({
    id: {
      in: ["params"],
      isString: true,
      isEmpty: false,
      optional: false,
    },
    tracking_number: {
      in: ["body"],
      isString: true,
      isEmpty: false,
      optional: false,
    },
  });
