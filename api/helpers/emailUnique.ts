import User from "../models/User";
import CustomError from "./customError";

const emailUnique = async (email: string) => {
  if (!email)
    throw new CustomError("El correo electrónico es obligatorio.", 409);
  const user = await User.findOne({ email });
  if (user) {
    throw new CustomError(
      `El correo electrónico ${email} actualmente está en uso.`,
      409
    );
  }
};

export default emailUnique;
