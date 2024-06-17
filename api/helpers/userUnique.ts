import User from "../models/User";
import FirebaseService from "../services/FirebaseServices";
import CustomError from "./customError";

const usernameUnique = async (username: string) => {
  if (!username)
    throw new CustomError("El nombre de usuario es requerido.", 409);
  const user = await User.findOne({ username });
  const { data } = await FirebaseService.getUserByUsername(username);
  if (user || data) {
    throw new CustomError(
      `El nombre de usuario ${username} actualmente está en uso.`,
      409
    );
  }
};

export default usernameUnique;
