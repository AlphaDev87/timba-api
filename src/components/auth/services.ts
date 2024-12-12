import jwtStrategy, { StrategyOptions } from "passport-jwt";
import { Token } from "@prisma/client";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JwtService } from "../../services/jwt.service";
import CONFIG, { ENVIRONMENTS } from "@/config";
import { TokenDAO } from "@/db/token";
import { JWTPayload, TokenPair, TokenResult } from "@/types/response/jwt";
import { PlayersDAO } from "@/db/players";
import { ERR } from "@/config/errors";
import { CustomError } from "@/helpers/error/CustomError";
import { UnauthorizedError } from "@/helpers/error";
import { SSEAuthentication } from "@/types/response/sse";
import { prisma } from "@/prisma";

export class AuthServices extends JwtService {
  private get cypherPass(): string {
    const secret = CONFIG.APP.CYPHER_PASS;
    if (!secret) {
      throw new CustomError({
        status: 500,
        code: "variables_entorno",
        description: "No se encontró CYPHER_PASS en .env",
      });
    }
    return secret;
  }

  /**
   * Generate access/refresh pair and link them to DB object
   * @param sub User ID
   * @param role User role
   */
  async tokens(sub: string, user_agent: string): Promise<TokenResult> {
    const dbToken = await TokenDAO.create({ player_id: sub, user_agent });
    return {
      tokens: this.generateTokenPair(sub, dbToken.id, this.cypherPass),
      jti: dbToken.id,
    };
  }

  /**
   * Generate new pair from refresh token
   */
  async refresh(refresh: string, req: Req): Promise<TokenPair> {
    if (!this.verifyTokenExpiration(refresh))
      throw new CustomError(ERR.TOKEN_EXPIRED);

    const payload = await this.verifyToken(refresh);
    if (!payload || typeof payload === "string")
      throw new CustomError(ERR.TOKEN_INVALID);

    if (payload.type !== "refresh") throw new CustomError(ERR.WRONG_TOKEN_TYPE);

    const token = await TokenDAO.getById(payload.jti);
    if (!token) throw new CustomError(ERR.TOKEN_INVALID);

    await this.validateUserAgent(req, payload.jti);

    if (token.invalid) {
      await this.invalidateChildren(token);
      throw new CustomError(ERR.TOKEN_INVALID);
    }

    const user_agent = req.headers["user-agent"] ?? "";
    const { tokens, jti } = await this.tokens(payload.sub, user_agent);
    // Invalidate received token and link it to newly created one.
    await TokenDAO.updateById(token.id, { invalid: true, next: jti });
    return tokens;
  }

  /**
   * Configure the JWT strategy for passport
   * @returns Strategy
   */
  jwtStrategy() {
    const options: StrategyOptions = {
      secretOrKey: this.cypherPass,
      jwtFromRequest: jwtStrategy.ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
    };

    return new jwtStrategy.Strategy(options, this.deserialize);
  }

  private deserialize: jwtStrategy.VerifyCallbackWithRequest = async (
    request: Req,
    payload: JWTPayload,
    done: jwtStrategy.VerifiedCallback,
  ) => {
    try {
      await this.validateUserAgent(request, payload.jti);
    } catch (error) {
      return done(error, false);
    }

    const token = await TokenDAO.getById(payload.jti);

    if (!token || token.invalid || payload.type !== "access")
      return done(new CustomError(ERR.TOKEN_INVALID), false);

    const user = await PlayersDAO._getById(payload.sub);
    return done(null, user);
  };

  private async validateUserAgent(req: Req, jti: string) {
    if (CONFIG.APP.ENV === ENVIRONMENTS.TEST) return;

    const token = await TokenDAO.getById(jti);
    const user_agent = req.headers["user-agent"] ?? "";

    if (!token || token.user_agent !== user_agent) {
      await this.invalidateTokenByUserAgent(user_agent);
      throw new UnauthorizedError("Token invalido");
    }
  }

  private async invalidateTokenByUserAgent(user_agent: string) {
    await TokenDAO.update({ user_agent }, { invalid: true });
  }

  private invalidateTokenById(token_id: string) {
    return TokenDAO.updateById(token_id, { invalid: true });
  }

  /**
   * Invalidate given token and all its children
   */
  private async invalidateChildren(token: Token) {
    await this.invalidateTokenById(token.id);
    while (token!.next) {
      token = await this.invalidateTokenById(token.next);
    }
  }

  async logout(user_id: string, encoded: string) {
    try {
      const payload = jwt.verify(encoded, this.cypherPass) as JwtPayload;
      if (payload === undefined) return;
      const token = await TokenDAO.authorizeRevocation(
        user_id,
        payload.jti as string,
      );
      await this.invalidateChildren(token);
    } catch (error: any) {
      if (error.name && error.name === "TokenExpiredError") return;
      throw error;
    }
  }

  getShortLivedSseToken(user_id: string): string {
    return this.generateShortSSEToken(this.cypherPass, user_id);
  }

  getLongLivedSseToken(user_id: string): string {
    return this.generateSSEToken(this.cypherPass, user_id);
  }

  verifyToken(token: string): Promise<string | JWTPayload | undefined> {
    return super.verifyToken(token, this.cypherPass);
  }

  /**
   * @param slt short-lived token
   * @param llt long-lived token
   */
  async authenticateSSE(slt: string, llt?: string): Promise<SSEAuthentication> {
    if (!slt && !llt) throw new UnauthorizedError("No autorizado");
    let userId: string;
    let jwt: string | undefined = undefined;

    const authService = new AuthServices();
    const sltPayload = await authService
      .verifyToken(slt)
      .catch(() => undefined);

    if (sltPayload) {
      userId = (sltPayload as JWTPayload).sub;
      jwt = authService.getLongLivedSseToken(userId);
    } else if (!llt) {
      throw new UnauthorizedError("No autorizado");
    } else {
      const lltPayload = await authService.verifyToken(llt).catch(() => {
        throw new UnauthorizedError("Token inválido");
      });

      if (!lltPayload) throw new UnauthorizedError("Token inválido");
      userId = (lltPayload as JWTPayload).sub;
    }

    const user = await prisma.player.findUnique({
      where: { id: userId },
      include: { roles: true },
    });
    const isAgent = user!.roles.some(
      (role) => role.name === CONFIG.ROLES.AGENT,
    );

    return { userId, isAgent, jwt };
  }
}
