import { Analytics } from "@prisma/client";
import { checkSchema } from "express-validator";
import { isKeyOfNestedObject } from "../players/validators";

const isDashedAlphaNumeric = (value: string) => !/[^a-zA-Z0-9\-_]/.test(value);

export const validateId = () =>
  checkSchema({
    id: {
      in: ["params"],
      isString: true,
      notEmpty: true,
      trim: true,
    },
  });

export const validateAnalyticsRequest = () =>
  checkSchema({
    source: {
      in: ["body"],
      isString: true,
      custom: {
        options: isDashedAlphaNumeric,
        errorMessage: "invalid source",
      },
      notEmpty: true,
      trim: true,
      errorMessage: "source is required",
    },
    event: {
      in: ["body"],
      isString: true,
      custom: {
        options: isDashedAlphaNumeric,
        errorMessage: "invalid event",
      },
      notEmpty: true,
      trim: true,
      errorMessage: "event is required",
    },
    data: {
      in: ["body"],
      custom: {
        options: (value) => {
          // Validar que sea un objeto, o undefined si es opcional
          if (value && typeof value !== "object") {
            throw new Error("data must be a valid object");
          }
          return true;
        },
      },
      optional: true,
      errorMessage: "data must be a valid object",
    },
  });

export const validateResourceSearchRequest = (isKeyOf: KeyIsKeyOfTValidator) =>
  checkSchema({
    page: {
      in: ["query"],
      default: { options: 1 },
      isInt: {
        options: { min: 1, max: 2 ** 32 },
        errorMessage: "page must be greater than 0",
      },
      toInt: true,
    },
    items_per_page: {
      in: ["query"],
      default: { options: 20 },
      customSanitizer: { options: (value) => (value <= 0 ? 20 : value) },
      isInt: {
        options: { min: 1, max: 2 ** 32 },
        errorMessage: "items_per_page must be greater than 0",
      },
      toInt: true,
    },
    search: {
      in: ["query"],
      isString: true,
      optional: true,
      trim: true,
    },
    sort_column: {
      in: ["query"],
      isString: true,
      optional: true,
      trim: true,
      custom: { options: isKeyOf, errorMessage: "Invalid sort_column" },
    },
    sort_direction: {
      in: ["query"],
      isString: true,
      optional: true,
      trim: true,
      custom: {
        options: isSortDirection,
        errorMessage: "sort_direction must be 'asc' or 'desc'",
      },
    },
    // Nuevos filtros
    source: {
      in: ["query"],
      isString: true,
      optional: true,
      trim: true,
    },
    event: {
      in: ["query"],
      isString: true,
      optional: true,
      trim: true,
    },
    window: {
      in: ["query"],
      isString: true,
      optional: true,
      custom: {
        options: (value) => ["day", "week", "month"].includes(value),
        errorMessage:
          "Invalid value for window. Allowed values are 'day', 'week', or 'month'.",
      },
    },
    windowPage: {
      in: ["query"],
      default: { options: 1 },
      optional: true,
      isInt: {
        options: { min: 0, max: 2 ** 32 },
        errorMessage: "page must be greater than 0",
      },
      toInt: true,
    },
  });

export const isKeyOfAnalytics = (key: string): key is keyof Analytics => {
  const mockAnalytics: Analytics = {
    id: "",
    source: "",
    event: "",
    data: {},
    created_at: new Date(),
    updated_at: new Date(),
  };
  return isKeyOfNestedObject(mockAnalytics, key);
};

export type KeyIsKeyOfTValidator = {
  (key: string): boolean;
};

const isSortDirection = (key: string): key is "asc" | "desc" => {
  return key === "asc" || key === "desc";
};

export type TimeWindow = "day" | "week" | "month";
