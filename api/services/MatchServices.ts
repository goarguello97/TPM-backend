import CustomError from "../helpers/customError";
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
}
