import CONFIG from "@/config";
import { UnauthorizedError } from "@/helpers/error";

export function requireAgentRole(req: Req, _res: Res, next: NextFn) {
  if (!req.user!.roles.some((r) => r.name === CONFIG.ROLES.AGENT))
    throw new UnauthorizedError("No autorizado");
  return next();
}

export function requireUserRole(req: Req, _res: Res, next: NextFn) {
  if (!req.user!.roles.some((r) => r.name === CONFIG.ROLES.PLAYER))
    throw new UnauthorizedError("No autorizado");
  return next();
}
