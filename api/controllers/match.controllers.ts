import { Request, Response } from "express";
import Match from "../models/Match";
import User from "../models/User";

class MatchController {
  static async matchRequest(req: Request, res: Response) {
    const { idUser, idUserToMatch } = req.body;
    const user = await User.findById(idUser);
    const userToMatch = await User.findById(idUserToMatch);
    try {
      const newMatch = new Match({
        user: idUser,
        userMatch: idUserToMatch,
      });
      await newMatch.save();
      user.matchSend = user.matchSend.concat(userToMatch._id);
      userToMatch.matchReq = userToMatch.matchReq.concat(user._id);
      await user.save();
      await userToMatch.save();
      res.status(201).json({ message: "Solicitud enviada" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default MatchController;
