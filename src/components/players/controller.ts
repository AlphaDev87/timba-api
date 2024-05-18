import { NOT_FOUND, OK, CREATED } from "http-status/lib";
import { Response } from "express";
import { Player } from "@prisma/client";
import { AuthServices } from "../auth/services";
import { PlayerServices } from "./services";
import { apiResponse } from "@/helpers/apiResponse";
import { Credentials, PlayerRequest } from "@/types/request/players";
import { NotFoundException, UnauthorizedError } from "@/helpers/error";
import { PlayersDAO } from "@/db/players";

export class PlayersController {
  static index = async (req: Req, res: Response, next: NextFn) => {
    try {
      const page = Number(req.query.page) - 1;
      const itemsPerPage = Number(req.query.items_per_page) ?? 20;
      const search = req.query.search as string;
      const sortColumn = req.query.sort_column as keyof Player;
      const sortDirection = req.query.sort_direction as SortDirection;

      const playersServices = new PlayerServices();

      const players = await playersServices.getAllPlayers(
        page,
        itemsPerPage,
        search,
        { [sortColumn]: sortDirection },
      );
      const totalPlayers = await PlayersDAO.count;

      res.status(OK).json(apiResponse({ players, totalPlayers }));
    } catch (error) {
      next(error);
    }
  };

  static show = async (
    req: Req,
    res: Response<any, Record<string, any>>,
    next: NextFn,
  ) => {
    try {
      if (!req.user) throw new UnauthorizedError("No autorizado");
      await PlayersDAO.authorizeShow(req.user, req.params.id);

      const playerId = req.params.id;

      const playersServices = new PlayerServices();

      const player = await playersServices.getPlayerById(playerId);

      if (player) {
        res.status(OK).json(apiResponse(player));
      } else {
        res
          .status(NOT_FOUND)
          .json(apiResponse(null, new NotFoundException("User not found")));
      }
    } catch (error) {
      next(error);
    }
  };

  /**
   * Creates a player.
   */
  static create = async (req: Req, res: Res, next: NextFn) => {
    try {
      const playersServices = new PlayerServices();
      const authServices = new AuthServices();

      const request: PlayerRequest = req.body;
      const user_agent = req.headers["user-agent"];

      const player = await playersServices.create(request);
      const { tokens } = await authServices.tokens(player.id, user_agent);
      const response = { ...tokens, player };

      res.status(CREATED).json(apiResponse(response));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Login player
   */
  static login = async (req: Req, res: Res, next: NextFn) => {
    try {
      const playersServices = new PlayerServices();

      const credentials: Credentials = req.body;
      const user_agent = req.headers["user-agent"];

      const loginResponse = await playersServices.login(
        credentials,
        user_agent,
      );

      res.status(OK).json(apiResponse(loginResponse));
    } catch (error) {
      next(error);
    }
  };

  static update = async (req: Req, res: Res, next: NextFn) => {
    try {
      const playersServices = new PlayerServices();

      const playerId = req.params.id;
      const request: PlayerRequest = req.body;

      const player = await playersServices.update(playerId, request);

      res.status(OK).json(apiResponse(player));
    } catch (error) {
      next(error);
    }
  };
}
