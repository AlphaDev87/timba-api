import { ErrorData } from "@/types/response/error";

export const ERR: { [key: string]: ErrorData } = {
  USER_ALREADY_EXISTS: {
    status: 400,
    code: "ya_existe",
    description: "Un usuario con ese nombre ya existe",
  },
  INVALID_CREDENTIALS: {
    status: 404,
    code: "credenciales_invalidas",
    description: "Usuario o contraseña incorrectos",
  },
  AGENT_LOGIN: {
    status: 500,
    code: "agent_login",
    description: "Error al loguear el agente en el panel",
  },
  EXTERNAL_LOGIN: {
    status: 500,
    code: "external_login",
    description: "Error en login externo",
  },
  TOKEN_EXPIRED: {
    status: 401,
    code: "token_expirado",
    description: "Token expirado",
  },
  TOKEN_INVALID: {
    status: 401,
    code: "token_invalido",
    description: "Token invalido",
  },
  TOKEN_REVOKED: {
    status: 401,
    code: "double_token_usage",
    description: "Token invalido",
  },
  WRONG_TOKEN_TYPE: {
    status: 401,
    code: "wrong_token_type",
    description: "Token invalido",
  },
  KEY_NOT_FOUND: {
    status: 500,
    code: "env",
    description: "No se encontro la llave en .env",
  },
  AGENT_PASS_NOT_SET: {
    status: 500,
    code: "env",
    description: "No se encontro la clave de agente en .env",
  },
  AGENT_UNSET: {
    status: 500,
    code: "agent_unset",
    description: "No se encontro el agente en la BD. ¿Corriste npm run seed?",
  },
  ALQ_URL_NOT_FOUND: {
    status: 500,
    code: "env",
    description: "No se encontro la url de Alquimia en .env",
  },
  ALQ_AUTH_NOT_FOUND: {
    status: 500,
    code: "env",
    description:
      "No se encontro la clave de autenticacion de Alquimia en .env (Basic auth)",
  },
  ALQ_TOKEN_ERROR: {
    status: 500,
    code: "alquimia",
    description: "Error en Alquimia al obtener token.",
  },
  TRANSACTION_LOG: {
    status: 500,
    code: "transaction_log",
    description: "Error al loguear transaccion",
  },
  TOO_MANY_REQUESTS: {
    status: 429,
    code: "too_many_requests",
    description: "Demasiadas solicitudes",
  },
  DEPOSIT_ALREADY_EXISTS: {
    status: 400,
    code: "already_exists",
    description: "Deposito ya existe",
  },
  PLAYER_CREATE: {
    status: 500,
    code: "agent_api_error",
    description: "Error en el panel al crear el usuario",
  },
};
