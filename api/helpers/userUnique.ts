import User from "../models/User";

const usernameUnique = async (username: string) => {
  if (!username) throw new Error("El nombre de usuario es requerido.");
  const user = await User.findOne({ username });
  if (user) {
    throw new Error(
      `El nombre de usuario ${username} actualmente está en uso.`
    );
  }
};

export default usernameUnique;
