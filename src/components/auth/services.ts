import jwtStrategy, { StrategyOptions } from "passport-jwt";
import { Token } from "@prisma/client";
import { JwtService } from "../../services/jwt.service";
import CONFIG from "@/config";
import { UnauthorizedError } from "@/helpers/error";
import { CustomError, ERR } from "@/middlewares/errorHandler";
import { TokenDAO } from "@/db/token";
import { JWTPayload, TokenPair, TokenResult } from "@/types/response/jwt";
import { PlayersDAO } from "@/db/players";

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
  async tokens(
    sub: number,
    role: string,
    userAgent?: string,
  ): Promise<TokenResult> {
    const dbToken = await TokenDAO.create({ player_id: sub, userAgent });
    return {
      tokens: this.generateTokenPair(sub, role, dbToken.id, this.cypherPass),
      jti: dbToken.id,
    };
  }

  /**
   * Generate new pair from refresh token
   */
  async refresh(refresh: string, userAgent?: string): Promise<TokenPair> {
    if (!this.verifyTokenExpiration(refresh))
      throw new CustomError(ERR.TOKEN_EXPIRED);

    const payload = this.decodePayload(refresh);
    if (payload.type !== "refresh") throw new CustomError(ERR.TOKEN_INVALID);

    let token = await TokenDAO.getById(payload.jti);
    if (!token) throw new CustomError(ERR.TOKEN_INVALID);

    if (token.userAgent != userAgent)
      token = await this.invalidateToken(token);

    if (token.invalid) {
      while (token!.next) {
        token = await this.invalidateToken(token);
      }
      // TODO
      // notify("Uso duplicado de refresh token");
      throw new CustomError(ERR.TOKEN_INVALID);
    }

    const { tokens, jti } = await this.tokens(
      payload.sub,
      payload.role,
      userAgent,
    );
    // Invalidate received token and link it to newly created one.
    await TokenDAO.update(token.id, { invalid: true, next: jti });
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

    const deserialize: jwtStrategy.VerifyCallbackWithRequest = async (
      request: Req,
      payload: JWTPayload,
      done: jwtStrategy.VerifiedCallback,
    ) => {
      // Check token validity
      const token = await TokenDAO.getById(payload.jti);
      if (
        !token ||
        token.invalid ||
        payload.type !== "access" ||
        token.userAgent != request.headers["user-agent"]
      )
        return done(new CustomError(ERR.TOKEN_INVALID), false);

      if (payload.role === CONFIG.ROLES.AGENT)
        return done(null, { username: "agent", role: payload.role });

      if (payload.role === CONFIG.ROLES.PLAYER) {
        const player = await PlayersDAO._getById(payload.sub);
        return done(null, { ...player, role: payload.role });
      } else return done(new UnauthorizedError("No autenticado"));
    };

    return new jwtStrategy.Strategy(options, deserialize);
  }

  private invalidateToken(token: Token) {
    return TokenDAO.update(token.id, { invalid: true });
  }
}
