import { Request, Response } from "express";
import MatchSerivices from "../services/MatchServices";

export default class MatchController {
  static async match(req: Request, res: Response) {
    const { idUser, idUserToMatch } = req.body;

    const { error, data } = await MatchSerivices.match(idUser, idUserToMatch);

    if (error) return res.status(404).json(data);

    return res.status(200).json(data);
  }

  static async responseMatch(req: Request, res: Response) {
    const { idReceivingUser, response } = req.body;

    const { error, data } = await MatchSerivices.responseMatch(
      idReceivingUser,
      response
    );
    console.log(data)
    if (error) return res.status(404).json(data);

    return res.status(200).json(data);
  }
}
