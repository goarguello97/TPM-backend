import User from "../models/User";
import CustomError from "./customError";

const usernameUnique = async (username: string) => {
  if (!username)
    throw new CustomError("El nombre de usuario es requerido.", 409);
  const user = await User.findOne({ username });
  if (user) {
    throw new CustomError(
      `El nombre de usuario ${username} actualmente está en uso.`,
      409
    );
  }
};

export default usernameUnique;
