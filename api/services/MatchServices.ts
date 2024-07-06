import CustomError from "../helpers/customError";
import { IUser } from "../interfaces/IUser";
import Match from "../models/Match";
import User from "../models/User";

export default class MatchSerivices {
  static async match(idUser: string, idUserToMatch: string) {
    try {
      if (!idUser || !idUserToMatch)
        throw new CustomError("No a ingresado el id correspondiente.", 404);

      const [user, userToMatch] = await Promise.all([
        User.findById(idUser),
        User.findById(idUserToMatch),
      ]);

      if (!user && !userToMatch)
        throw new CustomError("No existe uno de los usuarios.", 404);

      if (!user) throw new CustomError("No existe uno de los usuarios.", 404);

      if (!userToMatch)
        throw new CustomError("No existe uno de los usuarios.", 404);

      const newMatch = new Match({ user: idUser, userMatch: idUserToMatch });

      await newMatch.save();

      user.matchSend = user.matchSend.concat(userToMatch.id);
      userToMatch.matchReq = userToMatch.matchReq.concat(user.id);

      await user.save();
      await userToMatch.save();

      return { error: false, data: { message: "Solicitud enviada." } };
    } catch (error) {
      if (error instanceof CustomError) {
        return {
          error: true,
          data: { code: error.code, message: error.message },
        };
      } else {
        return { error: true, data: error };
      }
    }
  }

  static async responseMatch(idReceivingUser: string, response: true) {
    try {
      if (!idReceivingUser && !response && typeof response !== "boolean")
        throw new CustomError("No existen argumentos válidos.", 404);

      if (!idReceivingUser)
        throw new CustomError("No a ingresado el id correspondiente.", 404);

      if (!response && typeof response !== "boolean")
        throw new CustomError("No existe respuesta", 404);

      /* const match = await Match.find(); */
      const match = await Match.find({ userMatch: idReceivingUser })
        .populate<{ user: IUser }>({
          path: "user",
          select: "_id",
        })
        .populate<{ userMatch: IUser }>({
          path: "userMatch",
          select: "_id",
        });

      if (match.length < 0)
        throw new CustomError("No existe la solicitud.", 404);

      if (response) {
        await Promise.all([
          // Added the id to the match section once accepted.
          User.findByIdAndUpdate(
            { _id: match[0].user._id },
            { $push: { match: match[0].userMatch._id } },
            { new: true }
          ),
          User.findByIdAndUpdate(
            { _id: match[0].userMatch._id },
            { $push: { match: match[0].user._id } },
            { new: true }
          ),
          // If accepted, the request is deleted from the database.
          Match.findByIdAndDelete(match[0]._id),
          // The respective request ids matchReq and matchSend are removed, in sender as receiver.
          User.findByIdAndUpdate(
            { _id: match[0].user._id },
            { $pull: { matchSend: match[0].userMatch._id } },
            { new: true }
          ),
          User.findByIdAndUpdate(
            { _id: match[0].userMatch._id },
            { $pull: { matchReq: match[0].user._id } },
            { new: true }
          ),
        ]);

        return {
          error: false,
          data: { message: "Match aceptado correctamente." },
        };
      }

      await Promise.all([
        // The respective request ids matchReq and matchSend are removed, in sender as receiver.
        User.findByIdAndUpdate(
          { _id: match[0].user._id },
          { $pull: { matchSend: match[0].userMatch._id } },
          { new: true }
        ),
        User.findByIdAndUpdate(
          { _id: match[0].userMatch._id },
          { $pull: { matchReq: match[0].user._id } },
          { new: true }
        ),
        // If it is rejected, it is deleted anyway.
        Match.findByIdAndDelete(match[0]._id),
      ]);

      return {
        error: false,
        data: { message: "Match rechazado correctamente." },
      };
    } catch (error) {
      if (error instanceof CustomError) {
        return {
          error: true,
          data: { code: error.code, message: error.message },
        };
      } else {
        return { error: true, data: error };
      }
    }
  }
}
