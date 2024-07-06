import { generateTokenRegister } from "../config/token";
import CustomError from "../helpers/customError";
import Photo from "../models/Photo";
import User from "../models/User";
import bcrypt from "bcrypt";
import { getTemplate, transporter } from "../utils/mail";
import { IRegisterUser } from "../interfaces/IRegisterUser";
import Role from "../models/Role";
import { v4 as uuid } from "uuid";
import path from "path";
import FirebaseService from "./FirebaseServices";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { signInWithEmailAndPassword } from "firebase/auth";
import { loginAuth, storage } from "../config/firebase";
import { FirebaseError } from "firebase/app";

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

  static async getById(id: string) {
    try {
      const user = await User.findById(id)
        .select("-password")
        .populate("avatar", { imageUrl: 1 })
        .populate("role", { role: 1 });
      if (!user) throw new CustomError("Usuario no encontrado.", 404);
      return { error: false, data: user };
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

      await FirebaseService.addUserFirebase(email, username, password);
      await newUser.save();

      return { error: false, data: newUser };
    } catch (error) {
      console.log(error);
      return { error: true, data: error };
    }
  }

  static async putUser(id: string, user: IRegisterUser) {
    const { password } = user;
    let userUpdated;
    try {
      if (password === undefined) {
        userUpdated = await User.findByIdAndUpdate(id, user, {
          new: true,
        }).select("-password");
      } else {
        const salt = await bcrypt.genSalt(10);
        const passwordEncrypted = await bcrypt.hash(password, salt);

        user.password = passwordEncrypted;
        userUpdated = await User.findByIdAndUpdate(id, user, {
          new: true,
        }).select("-password");
      }
      if (!userUpdated) throw new CustomError("Usuario no encontrado.", 404);
      return { error: false, data: userUpdated };
    } catch (error) {
      if (error instanceof CustomError) {
        return {
          error: true,
          data: { message: error.message, code: error.code },
        };
      }
      return { error: true, data: error };
    }
  }

  static async deleteUser(idAdmin: string, idUserToDelete: string) {
    const possibleAdmin = await User.findById(idAdmin);
    const role = await Role.findById(possibleAdmin?.role);

    try {
      if (!role) {
        throw new CustomError("Rol no especifícado.", 404);
      }
      if (role.role !== "ADMIN")
        throw new CustomError("No posees los permisos necesarios.", 404);
      await User.findByIdAndDelete(idUserToDelete);
      return {
        error: false,
        data: { message: "Usuario eliminado satisfacoriamente." },
      };
    } catch (error) {
      if (error instanceof CustomError) {
        return {
          error: true,
          data: { message: error.message, code: error.code },
        };
      }
      return { error: true, data: error };
    }
  }

  static async addAvatar(file: Express.Multer.File, id: string) {
    try {
      if (!file) throw new CustomError("Imagen no existe.", 404);

      const user = await User.findById(id).populate("avatar", { imageUrl: 1 });

      if (!user) throw new CustomError("Usuario no existe.", 404);

      if (user.avatar) {
        const oldPhoto = await Photo.findById(user.avatar._id);
        if (!oldPhoto) throw new CustomError("Avatar no existe.", 404);

        if (oldPhoto.title !== "default") {
          const fileToRemove = ref(storage, `avatars/${oldPhoto?.title}`);
          const deletingPhoto = await deleteObject(fileToRemove);
          await oldPhoto.deleteOne();
        }
      }

      const fileName = uuid() + path.extname(file.originalname!);

      {
        /* Continua la carga normal del nuevo archivo */
      }
      const storageRef = ref(storage, `avatars/${fileName}`);

      const metadata = {
        contentType: file.mimetype,
      };

      const snapshot = await uploadBytesResumable(
        storageRef,
        file.buffer!,
        metadata
      );

      const downloadURL = await getDownloadURL(snapshot.ref);

      const newPhoto = {
        title: fileName,
        imageUrl: downloadURL,
      };

      const photo = new Photo(newPhoto);
      await photo.save();

      user.avatar = photo._id;
      await user.save();

      return { error: false, data: user };
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

  static async login(email: string, password: string) {
    try {
      const { user } = await signInWithEmailAndPassword(
        loginAuth,
        email,
        password
      );

      const token = await user.getIdToken();

      localStorage.setItem("firebaseToken", token);

      return { error: false, data: { ...user, token } };
    } catch (error) {
      if (error instanceof FirebaseError) {
        return { error: true, data: error.code };
      }
      return { error: true, data: error };
    }
  }
}
