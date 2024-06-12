import User from "../models/User";

const emailUnique = async (email: string) => {
  if (!email) throw new Error("El correo electrónico es obligatorio.");
  const user = await User.findOne({ email });
  if (user) {
    throw new Error(`El correo electrónico ${email} actualmente está en uso.`);
  }
};

export default emailUnique;
