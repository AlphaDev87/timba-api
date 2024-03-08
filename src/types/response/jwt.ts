export interface JWTPayload {
  sub: number;
  role: string;
  jti: string;
  type: "access" | "refresh";
  exp: number;
  iat: number;
}

export interface TokenResult {
  tokens: TokenPair;
  jti: string;
}

export interface TokenPair {
  access: string;
  refresh: string;
}
