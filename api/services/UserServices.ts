import { generateTokenRegister } from "../config/token";
import CustomError from "../helpers/customError";
import Photo from "../models/Photo";
import User from "../models/User";
import bcrypt from "bcrypt";
import { getTemplate, transporter } from "../utils/mail";
import { IRegisterUser } from "../interfaces/IRegisterUser";

const EMAIL = process.env.EMAIL;
export default class UserServices {
  static async getUsers() {
    try {
      const response = await User.find();
      return { error: false, data: response };
    } catch (error) {
      console.log(error);
      return { error: true, data: error };
    }
  }

  static async addUser(user: IRegisterUser) {
    const { username, name, lastname, email, password, role, dateOfBirth } =
      user;
    const userEmail = await User.find({ email });
    const userUsername = await User.find({ username });
    const defaultAvatar = await Photo.findOne({ title: "default" });

    try {
      if (userEmail.length > 0 && userUsername.length > 0)
        throw new CustomError(
          "El nombre de usuario y correo electrónico ya están en uso.",
          403
        );
      if (userUsername.length > 0)
        throw new CustomError("El nombre de usuario ya está en uso.", 403);
      if (userEmail.length > 0)
        throw new CustomError("El correo electrónico ya está en uso.", 403);

      const salt = await bcrypt.genSalt(10);
      const passwordEncrypted = await bcrypt.hash(password, salt);

      const newUser = new User({
        username,
        name,
        lastname,
        email,
        password: passwordEncrypted,
        role,
        dateOfBirth,
        avatar: defaultAvatar?._id,
      });

      const token = generateTokenRegister(newUser);
      const template = getTemplate(username, token);

      await transporter.sendMail({
        from: `The Perfect Mentor <${EMAIL}>`,
        to: email,
        subject: "Verificar cuenta",
        text: "...",
        html: template,
      });

      await newUser.save();

      return { error: false, data: newUser };
    } catch (error) {
      console.log(error);
      return { error: true, data: error };
    }
  }
}
