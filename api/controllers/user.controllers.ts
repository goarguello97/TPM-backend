import { Request, Response } from "express";
import CustomError from "../helpers/customError";
import User from "../models/User";
import Photo from "../models/Photo";
import Role from "../models/Role";
import { v4 as uuid } from "uuid";
import multer from "multer";
import path from "path";
import bcrypt from "bcrypt";
import firebase from "../config/firebase.config";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import { initializeApp } from "firebase/app";
import {
  dataToken,
  generateToken,
  generateTokenRecover,
  generateTokenRegister,
} from "../config/token";
import { AuthRequest } from "../interfaces/requestInterface";
import { getTemplate, getTemplateRecover, transporter } from "../utils/mail";
import { VALUES } from "../constants/values";

initializeApp(firebase.firebaseConfig);
const storage = getStorage();
export const upload = multer({ storage: multer.memoryStorage() });

class UserController {
  static async getUsers(req: Request, res: Response) {
    try {
      const users = await User.find().populate("role");
      res.status(200).json({ status: "Success", payload: { users } });
    } catch (error) {
      res
        .status(error.code || 500)
        .json({ status: "Error", payload: { message: error.message } });
    }
  }

  static async getUser(req: Request, res: Response) {
    const { id } = req.query;
    try {
      const user = await User.findById(id)
        .select("-password")
        .populate("avatar", { imageUrl: 1 })
        .populate("role", { role: 1 });
      if (!user) throw new CustomError("User not found.", 404);
      res.status(200).json({ status: "Success", payload: { user } });
    } catch (error) {
      res
        .status(500)
        .json({ status: "Error", payload: { message: error.message } });
    }
  }

  static async addUser(req: Request, res: Response) {
    const { username, name, lastname, email, password, role, dateOfBirth } =
      req.body;
    const userEmail = await User.find({ email });
    const userUsername = await User.find({ username });
    const defaultAvatar = await Photo.findOne({ title: "default" });
    try {
      if (userEmail.length > 0 && userUsername.length > 0)
        throw new CustomError("The username and email already exist.", 403);
      // return res
      //   .status(403)
      //   .json({ status: "Error", message: "El usuario y email ya existe" });
      if (userUsername.length > 0)
        throw new CustomError("The username already exist.", 403);
      // return res
      //   .status(403)
      //   .json({ status: "Error", message: "El usuario ya existe" });
      if (userEmail.length > 0)
        throw new CustomError("The email already exist.", 403);
      // return res
      //   .status(403)
      //   .json({ status: "Error", message: "El email ya existe" });
      const salt = await bcrypt.genSalt(10);
      const passWordEncrypted = await bcrypt.hash(password, salt);

      const newUser = new User({
        username,
        name,
        lastname,
        email,
        password: passWordEncrypted,
        role,
        dateOfBirth,
        avatar: defaultAvatar._id,
      });

      const token = generateTokenRegister(newUser);
      const template = getTemplate(username, token);

      await transporter.sendMail({
        from: `The Perfect Mentor <perfect.mentor.p5@gmail.com>`,
        to: email,
        subject: "Verify email",
        text: "...",
        html: template,
      });

      await newUser.save();

      res
        .status(201)
        .json({ status: "Success", payload: { message: "Usuario creado" } });
    } catch (error) {
      res
        .status(500)
        .json({ status: "Error", payload: { message: error.message } });
    }
  }

  static async updateUser(req: Request, res: Response) {
    const body = req.body;
    const { _id } = req.body;
    const { password } = req.body;
    try {
      let updatedUser;
      if (password.length === 0) {
        const { password, ...body } = req.body;
        updatedUser = await User.findByIdAndUpdate(_id, body, {
          new: true,
        });
      } else {
        req.body.password = bcrypt.hashSync(
          req.body.password,
          bcrypt.genSaltSync(10)
        );
        updatedUser = await User.findByIdAndUpdate(_id, body, {
          new: true,
        });
      }
      if (!updatedUser) throw new CustomError("User not found.", 404);
      res.status(200).json({
        status: "Success",
        payload: { user: updatedUser, message: "User updated." },
      });
    } catch (error) {
      res
        .status(400)
        .json({ status: "Error", payload: { message: error.message } });
    }
  }

  static async deleteUser(req: Request, res: Response) {
    const { idUser, idUserToDelete } = req.body;
    const user = await User.findById(idUser);
    const role = await Role.findById(user.role);
    try {
      if (!role) throw new CustomError("No role specified.", 404);
      if (role.role !== "ADMIN")
        throw new CustomError(
          "You do not have the necessary permissions.",
          404
        );
      await User.findByIdAndDelete(idUserToDelete);
      res.status(200).json({
        status: "Success",
        payload: { message: "The user has been removed." },
      });
    } catch (error) {
      res
        .status(500)
        .json({ status: "Error", payload: { message: error.message } });
    }
  }

  static async loginUser(req: Request, res: Response) {
    const { email, password } = req.body;
    const user = await User.findOne({ email })
      .populate("role", {
        role: 1,
      })
      .populate("avatar", { imageUrl: 1 });
    try {
      if (!user) throw new CustomError("User not found.", 404);
      if (!user.verify)
        throw new CustomError("You must verify your account.", 401);
      const passwordOk = user.validatePassword(password);
      if (!passwordOk) throw new CustomError("Invalid credentials.", 401);
      const payload = {
        email: user.email,
        name: user.name,
        lastname: user.lastname,
        id: user.id,
        role: user.role,
        dateOfBirth: user.dateOfBirth,
        avatar: user.avatar,
      };
      const token = generateToken(payload);
      res.cookie("token", token);
      res.status(200).json({
        status: "Success",
        payload: { message: "Login correct.", user: payload, token },
      });
    } catch (error) {
      res
        .status(error.code || 500)
        .json({ status: "Error", payload: { message: error.message } });
    }
  }

  static async secret(req: AuthRequest, res: Response) {
    res.status(200).json({ status: "Success", payload: req.user });
  }

  static async logoutUser(req: Request, res: Response) {
    res.clearCookie("token");
    res.sendStatus(205);
  }

  static async verifyUser(req: Request, res: Response) {
    const { token } = req.params;
    try {
      const data = await dataToken(token);
      if (data === null) {
        return res.status(500).json({
          status: "Error",
          payload: { message: "The token has expired." },
        });
      }
      const { email } = data.user;
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ status: "Error", message: "Username does not exist." });
      }
      user.verify = true;
      await user.save();
      res.status(200).json({
        status: "Success",
        payload: { message: "Verified user." },
      });
    } catch (error) {
      res
        .status(error.code || 500)
        .json({ status: "Error", payload: { message: error.message } });
    }
  }

  static async recoverPassword(req: Request, res: Response) {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) throw new CustomError("User not found.", 404);

    try {
      const token = generateTokenRecover(user);
      const template = getTemplateRecover(user.username, token);
      try {
        await transporter.sendMail({
          from: `The Perfect Mentor <perfect.mentor.p5@gmail.com>`,
          to: email,
          subject: "Recover password",
          text: "...",
          html: template,
        });
      } catch (error) {
        res.status(500).json({ status: "Error", payload: { message: error } });
      }

      user.tokenRecover = token;
      await user.save();

      res.status(200).json({
        status: "Success",
        payload: { message: "Check your mailbox, please." },
      });
    } catch (error) {
      res
        .status(500)
        .json({ status: "Error", payload: { message: error.message } });
    }
  }

  static async authorizeChangePassword(req: Request, res: Response) {
    const { token } = req.params;
    try {
      const data = await dataToken(token);
      if (data === null) {
        return res.status(500).json({
          status: "Error",
          payload: { message: "The token has expired." },
        });
      }
      const { email } = data.user;
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ status: "Error", message: "Username does not exist." });
      }
      if (user.tokenRecover !== token)
        throw new CustomError("Token is not valid.", 404);
      // user.tokenRecover = "";
      // await user.save();
      res.status(200).json({
        status: "Success",
        payload: { user, message: "Authorized to modify." },
      });
    } catch (error) {
      res
        .status(error.code || 500)
        .json({ status: "Error", payload: { message: error.message } });
    }
  }

  static async updatePassword(req: Request, res: Response) {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new CustomError("User not found.", 404);
    try {
      const salt = await bcrypt.genSalt(10);
      const passWordEncrypted = await bcrypt.hash(password, salt);
      user.password = passWordEncrypted;
      await user.save();
      res.status(200).json({
        status: "Success",
        payload: { message: "Password changed successfully." },
      });
    } catch (error) {
      res
        .status(error.code || 500)
        .json({ status: "Error", payload: { message: error.message } });
    }
  }

  static async addAvatar(req: AuthRequest, res: Response) {
    const file = req.file;
    const { id } = req.body;

    try {
      if (!file) throw new CustomError("Image not exist.", 404);

      const user = await User.findById(id).populate("avatar", {
        imageUrl: 1,
      });
      {
        /* Si el usuario tiene avatar procedo por aca */
      }
      if (user.avatar) {
        const oldPhoto = await Photo.findById(user.avatar._id);
        {
          /* Borro el avatar antiguo de firebase */
        }
        if (oldPhoto.title !== VALUES.DEFAULT) {
          const fileToRemove = ref(storage, `avatars/${oldPhoto.title}`);
          const deletingPhoto = await deleteObject(fileToRemove);
          {
            /* Borro la referencia de mongo */
          }
          await oldPhoto.deleteOne();
        }
      }

      const fileName = uuid() + path.extname(req.file?.originalname!);

      {
        /* Continua la carga normal del nuevo archivo */
      }
      const storageRef = ref(storage, `avatars/${fileName}`);

      const metadata = {
        contentType: req.file?.mimetype,
      };

      const snapshot = await uploadBytesResumable(
        storageRef,
        req.file?.buffer!,
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

      console.log("File successfully uploaded");

      res.status(200).json({
        status: "Success",
        payload: {
          message: "File uploaded to firebase storage.",
          name: req.file?.originalname,
          type: req.file?.mimetype,
          downloadURL: downloadURL,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(400).send(error.message);
    }
  }
}

export default UserController;
