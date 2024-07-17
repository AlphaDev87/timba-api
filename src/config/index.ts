/* eslint-disable @typescript-eslint/no-var-requires */
// https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import pkg from "../../package.json";
// import "../../envLoader";
require("dotenv").config();

const CONFIG = {
  APP: {
    NAME: pkg.name,
    VERSION: pkg.version,
    VER: `v${pkg.version[0][0]}`,
    DESCRIPTION: pkg.description,
    AUTHORS: pkg.authors,
    HOST: process.env.APP_HOST,
    BASE_URL: process.env.API_BASE_URL,
    PORT: process.env.NODE_ENV === "test" ? 8888 : process.env.PORT || 8080,
    ENV: process.env.NODE_ENV,
    CYPHER_PASS: process.env.CYPHER_PASS,
    ALLOWED_ORIGIN: process.env.ALLOWED_ORIGIN,
  },
  SERVER: {
    TIMEOUT: 60000, // 1m
  },
  LOG: {
    PATH: process.env.LOGGING_DIR || "logs",
    LEVEL: process.env.LOGGING_LEVEL || "info",
    MAX_FILES: process.env.LOGGING_MAX_FILES || 5,
    CODES: [
      "agent_api_error",
      "external_login",
      "alquimia",
      "token_invalid",
      "wrong_token_type",
      "database_error",
    ],
  },
  AUTH: {
    SALT_ROUNDS: process.env.SALT_ROUNDS || "11",
    ACCESS_TOKEN_EXPIRE: process.env.ACCESS_TOKEN_DURATION || "10m",
    REFRESH_TOKEN_EXPIRE: process.env.REFRESH_TOKEN_DURATION || "8h",
    ACCESS_TOKEN_SALT: process.env.ACCESS_TOKEN_SALT,
    REFRESH_TOKEN_SALT: process.env.REFRESH_TOKEN_SALT,
    WEB_PUSH_PUBLIC_KEY: process.env.WEB_PUSH_PUBLIC_KEY,
    WEB_PUSH_PRIVATE_KEY: process.env.WEB_PUSH_PRIVATE_KEY,
    ALQUIMIA_BASIC_AUTH: process.env.ALQUIMIA_BASIC_AUTH,
    ALQUIMIA_USERNAME: process.env.ALQUIMIA_USERNAME,
    ALQUIMIA_PASSWORD: process.env.ALQUIMIA_PASSWORD,
    LOGTAIL_TOKEN: process.env.LOGTAIL_TOKEN,
    FINGERPRINT_COOKIE: "__Secure-Fgp",
    CASINO_PANEL_USER: process.env.CASINO_PANEL_USER,
    CASINO_PANEL_PASS: process.env.CASINO_PANEL_PASS,
  },
  AWS: {
    ACCESS_KEY: process.env.AWS_ACCESS_KEY,
    SECRET_KEY: process.env.AWS_SECRET_KEY,
    REGION: process.env.AWS_REGION,
    S3: {
      PATH: process.env.S3_BUCKET_PATH,
      BUCKET_NAME: process.env.S3_BUCKET_NAME,
    },
    COGNITO: {
      USER_POOL_ID: process.env.COGNITO_USER_POOL_ID,
      CLIENT_ID: process.env.COGNITO_CLIENT_ID,
    },
  },
  EXTERNAL: {
    API_KEY: process.env.API_KEY,
    AGENT_BASE_URL: process.env.AGENT_API_BASE_URL,
    PLAYER_BASE_URL: process.env.PLAYER_API_BASE_URL,
    ALQ_BASE_URL: process.env.ALQ_BASE_URL,
    ALQ_API_VERSION: process.env.ALQ_API_VERSION,
    ALQ_TOKEN_URL: process.env.ALQ_TOKEN_URL,
    ALQ_SAVINGS_ACCOUNT_ID: Number(process.env.ALQ_SAVINGS_ACCOUNT_ID),
    ALQ_API_KEY: process.env.ALQ_API_KEY,
  },
  INTERNAL: {
    BOT_API_PORT: process.env.BOT_API_PORT,
    BOT_API_BASE_URL: process.env.BOT_API_BASE_URL,
  },
  ROLES: {
    AGENT: "agent",
    PLAYER: "player",
  },
  /** Static Details */
  SD: {
    INSUFICIENT_BALANCE: "Saldo insuficiente",
    INSUFICIENT_CREDITS: "FichasInsuficientes",
    DEPOSIT_STATUS: {
      /** Created by user, awaiting confirmation at alquimia */
      PENDING: "pending",
      /** Found and verified at alquimia. Coins not sent yet */
      VERIFIED: "verified",
      /** Payment verified and coins sent to player. Not yet logged into DB */
      CONFIRMED: "confirmed",
      /** Allisgood */
      COMPLETED: "completed",
      /** Deleted by agent */
      DELETED: "deleted",
    },
    PAYMENT_STATUS: {
      /** Requested by player, awaiting to be released by agent */
      REQUESTED: "PEDIDO",
      /** Created, awaiting authorization */
      PENDING: "PENDIENTE AUTORIZAR",
      /** Authorized, processing */
      PROCESSING: "EN PROCESO",
      /** Awaiting provider's response */
      PROVIDER: "PENDIENTE RESPUESTA PROVEEDOR",
      /** Completed */
      COMPLETED: "LIQUIDADA",
      /** Error */
      ERROR: "error",
    },
    ENVIRONMENTS: {
      TEST: "test",
      DEV: "development",
      PRODUCTION: "production",
      STAGING: "staging",
    },
    PLAYER_WELCOME_MESSAGE: process.env.PLAYER_WELCOME_MESSAGE || "",
  },
  INFO: {
    NAME: pkg.name,
    VERSION: pkg.version,
    VER: `v${pkg.version[0][0]}`,
    DESCRIPTION: pkg.description,
    AUTHORS: pkg.authors,
  },
  BOT: {
    QR_PATHS: process.env.BOT_QR_PATHS ?? "",
  },
  EMAIL: {
    HOST: process.env.EMAIL_HOST,
    PORT: process.env.EMAIL_PORT,
    USER: process.env.EMAIL_USER,
    PASS: process.env.EMAIL_PASS,
    FROM: process.env.EMAIL_FROM,
  },
} as const;

export enum PLAYER_STATUS {
  ACTIVE = "ACTIVO",
  BANNED = "BLOQUEADO",
}

export default CONFIG;
