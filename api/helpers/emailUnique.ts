import User from "../models/User";


const emailUnique = async (email: string) => {
  if (!email) throw new Error("Email is required");
  const user = await User.findOne( { email } );
  if (user) {
    throw new Error(`The email ${email} is already in use.`);
  }
};

export default emailUnique;