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

export const validateOnCallRequest = () =>
  checkSchema({
    active: {
      in: ["body"],
      isBoolean: true,
      optional: false,
    },
  });

export const validateSupportRequest = () =>
  checkSchema({
    bot_phone: {
      in: ["body"],
      isString: true,
      optional: true,
      isNumeric: true,
      trim: true,
      errorMessage:
        "bot_phone must be a numeric string between 10 and 20 characters long",
      isLength: {
        options: { min: 10, max: 20 },
      },
    },
    human_phone: {
      in: ["body"],
      isString: true,
      optional: true,
      isNumeric: true,
      trim: true,
      errorMessage:
        "human_phone must be a numeric string between 10 and 20 characters long",
      isLength: {
        options: { min: 10, max: 20 },
      },
    },
  });

export const validateQrName = () =>
  checkSchema({
    name: {
      in: ["params"],
      isString: true,
      isEmpty: false,
      trim: true,
      isLength: {
        options: { min: 1, max: 10 },
      },
      customSanitizer: {
        options: (value: string) => value.toLowerCase().replaceAll(/[./]/g, ""),
      },
    },
  });
