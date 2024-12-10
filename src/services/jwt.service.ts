import jwt from "jsonwebtoken";
import { JWTPayload, TokenPair } from "@/types/response/jwt";
import CONFIG from "@/config";
import { CustomError } from "@/helpers/error/CustomError";
import { ERR } from "@/config/errors";
/**
 * Generates and verifies Json Web Tokens
 */
export class JwtService {
  protected fingerprintCookie!: string;
  protected userFingerprintSha256!: string;

  private get accessTokenExpire() {
    const { ACCESS_TOKEN_EXPIRE } = CONFIG.AUTH;
    if (!ACCESS_TOKEN_EXPIRE) {
      throw new CustomError(ERR.ACCESS_TOKEN_EXPIRE_NOT_SET);
    }
    return ACCESS_TOKEN_EXPIRE;
  }

  private get refreshTokenExpire() {
    const { REFRESH_TOKEN_EXPIRE } = CONFIG.AUTH;
    if (!REFRESH_TOKEN_EXPIRE) {
      throw new CustomError(ERR.REFRESH_TOKEN_EXPIRE_NOT_SET);
    }
    return REFRESH_TOKEN_EXPIRE;
  }

  private get sseTokenExpire() {
    const { SSE_TOKEN_EXPIRE } = CONFIG.AUTH;
    if (!SSE_TOKEN_EXPIRE) {
      throw new CustomError(ERR.SSE_TOKEN_EXPIRE_NOT_SET);
    }
    return SSE_TOKEN_EXPIRE;
  }

  /**
   * Verificar si el token está expirado
   * @param token the token to check
   * @returns true for valid token, false for expired token
   */
  verifyTokenExpiration(token: string): boolean {
    try {
      const payload = this.decodePayload(token);
      const currentTimeInSeconds = Math.floor(Date.now() / 1000);

      return !(Number(payload.exp) < currentTimeInSeconds + 10);
    } catch (error) {
      return false;
    }
  }

  decodePayload(token: string): JWTPayload {
    const bufer = Buffer.from(token.split(".")[1], "base64");
    const payloadJson = bufer.toString("utf8");
    return JSON.parse(payloadJson);
  }

  /**
   * Verify a token and return its payload
   */
  verifyToken(
    token: string,
    pass: string,
  ): Promise<string | JWTPayload | undefined> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, pass, (err, decoded) => {
        if (err) reject(err);
        resolve(decoded as string | JWTPayload | undefined);
      });
    });
  }

  /**
   * Generate token pair
   * @param sub User ID
   */
  generateTokenPair(sub: string, jti: string, pass: string): TokenPair {
    return {
      access: this.generateAccessToken(pass, sub, jti),
      refresh: this.generateRefreshToken(pass, sub, jti),
    };
  }

  private generateToken(
    pass: string,
    sub: string,
    type: "access" | "refresh" | "sse",
    expiresIn: string,
    jti?: string,
  ): string {
    const token = jwt.sign(
      // Payload
      {
        sub,
        jti,
        type,
        userFingerprint: this.userFingerprintSha256,
      },
      // Secret
      pass,
      // Options
      { expiresIn },
    );

    return token;
  }

  /**
   * Generate access token
   */
  private generateAccessToken(pass: string, sub: string, jti: string): string {
    const ACCESS_TOKEN_EXPIRE = this.accessTokenExpire;
    return this.generateToken(pass, sub, "access", ACCESS_TOKEN_EXPIRE, jti);
  }

  /**
   * Generate refresh token
   */
  private generateRefreshToken(pass: string, sub: string, jti: string) {
    const REFRESH_TOKEN_EXPIRE = this.refreshTokenExpire;
    return this.generateToken(pass, sub, "refresh", REFRESH_TOKEN_EXPIRE, jti);
  }

  /**
   * Generate SSE access token
   */
  generateSSEToken(pass: string, sub: string) {
    const SSE_TOKEN_EXPIRE = this.sseTokenExpire;
    return this.generateToken(pass, sub, "sse", SSE_TOKEN_EXPIRE);
  }
}
