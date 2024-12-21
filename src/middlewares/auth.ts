import CONFIG from "@/config";
import { PlayersDAO } from "@/db/players";
import {
  ForbiddenError,
  NotFoundException,
  UnauthorizedError,
} from "@/helpers/error";
import { CustomError } from "@/helpers/error/CustomError";
import { prisma } from "@/prisma";

export function requireAgentRole(req: Req, _res: Res, next: NextFn) {
  if (!req.user!.roles.some((r) => r.name === CONFIG.ROLES.AGENT))
    throw new ForbiddenError("No autorizado");
  return next();
}

export function requireUserRole(req: Req, _res: Res, next: NextFn) {
  if (!req.user!.roles.some((r) => r.name === CONFIG.ROLES.PLAYER))
    throw new ForbiddenError("No autorizado");
  return next();
}

export function requireUserOrAgentRole(req: Req, _res: Res, next: NextFn) {
  if (
    !req.user!.roles.some(
      (r) => r.name === CONFIG.ROLES.PLAYER || r.name === CONFIG.ROLES.AGENT,
    )
  )
    throw new ForbiddenError("No autorizado");
  return next();
}

export function requireCashierRole(req: Req, _res: Res, next: NextFn) {
  if (!req.user!.roles.some((r) => r.name === CONFIG.ROLES.CASHIER))
    throw new ForbiddenError("No autorizado");
  return next();
}

export async function apiKeyAuthentication(req: Req, _res: Res, next: NextFn) {
  if (req.headers["authorization"] !== "Bearer " + CONFIG.AUTH.BOT_API_KEY)
    throw new UnauthorizedError("No autenticado");

  const user = await prisma.player.findFirst({
    where: { roles: { some: { name: CONFIG.ROLES.AGENT } } },
    include: { roles: true, BankAccounts: true, Cashier: true },
  });
  if (!user)
    throw new CustomError({
      status: 500,
      code: "server_error",
      description: "No se encontró al agente en la base de datos.",
    });
  req.user = user;

  const { player_id } = req.params;
  if (!player_id) return next();

  const player = await PlayersDAO.findFirst({
    where: { id: player_id as string },
  });
  if (!player) throw new NotFoundException("Jugador no encontrado");
  req.player = player;

  return next();
}
