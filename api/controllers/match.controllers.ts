import { Request, Response } from "express";
import Match from "../models/Match";
import User from "../models/User";
import { MatchInterface } from "../interfaces/match.interface";
import { userInterface } from "../interfaces/user.interface";

class MatchController {
  static async matchRequest(req: Request, res: Response) {
    const { idUser, idUserToMatch } = req.body;
    const user = await User.findById(idUser);
    const userToMatch = await User.findById(idUserToMatch);
    if (!user && !userToMatch)
      return res.status(500).json({
        status: "Error",
        message: "No existe usuario emisor y receptor",
      });
    if (!user)
      return res
        .status(500)
        .json({ status: "Error", message: "No existe usuario emisor" });
    if (!userToMatch)
      return res
        .status(500)
        .json({ status: "Error", message: "No existe usuario receptor" });
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
      res
        .status(201)
        .json({ status: "Success", payload: { message: "Solicitud enviada" } });
    } catch (error) {
      res
        .status(500)
        .json({ status: "Error", payload: { message: error.message } });
    }
  }
  static async matchResponse(req: Request, res: Response) {
    const { idReceivingUser, response } = req.body;
    const match = await Match.find({ userMatch: idReceivingUser })
      .populate<{ user: userInterface }>("user", { _id: 1 })
      .populate<{ userMatch: userInterface }>("userMatch", { _id: 1 });
    // Si se rechaza la solicitud, esta se elimina de la base de datos y se eliminan los id de los respectivos users.
    try {
      if (response) {
        // Agregado del id a la seccion de match una vez aceptado.
        await User.findByIdAndUpdate(
          { _id: match[0].user._id },
          { $push: { match: match[0].userMatch._id } },
          { new: true }
        );
        await User.findByIdAndUpdate(
          { _id: match[0].userMatch._id },
          { $push: { match: match[0].user._id } },
          { new: true }
        );

        // Si se acepta, se elimina la solicitud de la base de datos.
        await Match.findByIdAndRemove(match[0]._id);

        // Se eliminan los respectivos id de la solicitud matchReq y matchSend, en remitente como receptor.
        await User.findByIdAndUpdate(
          { _id: match[0].user._id },
          { $pull: { matchSend: { $in: match[0].userMatch._id } } },
          { new: true }
        );
        await User.findByIdAndUpdate(
          { _id: match[0].userMatch._id },
          { $pull: { matchReq: { $in: match[0].user._id } } },
          { new: true }
        );
        return res.status(200).json({
          status: "Success",
          payload: { message: "Match aceptado correctamente." },
        });
      }

      // Se eliminan los respectivos id de la solicitud matchReq y matchSend, en remitente como receptor.
      await User.findByIdAndUpdate(
        { _id: match[0].user._id },
        { $pull: { matchSend: { $in: match[0].userMatch._id } } },
        { new: true }
      );
      await User.findByIdAndUpdate(
        { _id: match[0].userMatch._id },
        { $pull: { matchReq: { $in: match[0].user._id } } },
        { new: true }
      );

      // Si se rechaza, se elimina de todas formas.
      await Match.findByIdAndRemove(match[0]._id);

      res.status(200).json({
        status: "Success",
        payload: { message: "Match rechazado correctamente." },
      });
    } catch (error) {
      res
        .status(500)
        .json({ status: "Error", payload: { message: error.message } });
    }
  }
}

export default MatchController;
