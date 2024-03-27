import { Location, checkSchema } from "express-validator";

export const validateCredentials = () =>
  checkSchema({
    username: {
      in: ["body"],
      isString: true,
      isEmpty: false,
      trim: true,
    },
    password: {
      in: ["body"],
      isString: true,
      isEmpty: false,
      trim: true,
    },
  });

export const validatePaymentIndex = () =>
  checkSchema({
    id: {
      in: ["params"],
      isString: true,
      isEmpty: false,
    },
  });

export const validateBankAccountUpdate = () => {
  const optionalString: {
    in: Location[];
    isString: boolean;
    optional: boolean;
    trim: boolean;
    isEmpty: boolean;
  } = {
    in: ["body"],
    isString: true,
    optional: true,
    trim: true,
    isEmpty: false,
  };
  return checkSchema({
    name: optionalString,
    dni: optionalString,
    bankName: optionalString,
    accountNumber: optionalString,
    clabe: optionalString,
    alias: optionalString,
  });
};
