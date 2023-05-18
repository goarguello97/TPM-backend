import { Request, Response } from "express";
import CustomError from "../helpers/customError";
import User from "../models/User";
import bcrypt from "bcrypt";
import Role from "../models/Role";
import {
  dataToken,
  generateToken,
  generateTokenRegister,
} from "../config/token";
import { AuthRequest } from "../interfaces/requestInterface";
import { getTemplate, transporter } from "../utils/mail";

class UserController {
  static async getUsers(req: Request, res: Response) {
    try {
      const users = await User.find();
      res.status(200).json({ users });
    } catch (error) {
      res.status(error.code || 500).json({ message: error.message });
    }
  }

  static async getUser(req: Request, res: Response) {
    const { id } = req.query;
    try {
      const user = await User.findById(id);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  static async addUser(req: Request, res: Response) {
    const { username, name, lastname, email, password, role } = req.body;
    const userEmail = await User.find({ email });
    const userUsername = await User.find({ username });
    try {
      if (userEmail.length > 0 && userUsername.length > 0)
        return res
          .status(403)
          .json({ message: "El usuario y email ya existe" });
      if (userUsername.length > 0)
        return res.status(403).json({ message: "El usuario ya existe" });
      if (userEmail.length > 0)
        return res.status(403).json({ message: "El email ya existe" });
      const salt = await bcrypt.genSalt(10);
      const passWordEncrypted = await bcrypt.hash(password, salt);

      const newUser = new User({
        username,
        name,
        lastname,
        email,
        password: passWordEncrypted,
        role,
      });

      const token = generateTokenRegister(newUser);
      const template = getTemplate(username, token);

      try {
        await transporter.sendMail({
          from: `The Perfect Mentor <perfect.mentor.p5@gmail.com>`,
          to: email,
          subject: "Verificar mail",
          text: "...",
          html: template,
        });
      } catch (error) {
        res.status(500).json({ message: error });
      }
      await newUser.save();
      res.status(201).json({ message: "Usuario creado" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async updateUser(req: Request, res: Response) {
    const body = req.body;
    const { id } = req.query;
    try {
      if (req.body.password) {
        req.body.password = bcrypt.hashSync(
          req.body.password,
          bcrypt.genSaltSync(10)
        );
      }
      const updatedUser = await User.findByIdAndUpdate(id, body, { new: true });
      if (!updatedUser) throw new CustomError("El usuario no existe", 404);
      res.status(200).json({ message: "Usuario actualizado", updatedUser });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async deleteUser(req: Request, res: Response) {
    const { idUser, idUserToDelete } = req.body;
    const user = await User.findById(idUser);
    const role = await Role.findById(user.role);
    try {
      if (!role) throw new CustomError("No existe rol especificado", 404);
      if (role.role !== "ADMIN")
        throw new CustomError("No tiene los permisos necesarios", 404);
      await User.findByIdAndDelete(idUserToDelete);
      res.status(200).json({ message: "El usuario ha sido eliminado" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async loginUser(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) throw new CustomError("Usuario no encontrado", 404);
      if (!user.verify) throw new CustomError("Debes verificar tu cuenta", 401);
      const passwordOk = user.validatePassword(password);
      if (!passwordOk) throw new CustomError("Credenciales inválidas", 401);
      const payload = {
        email: user.email,
        name: user.name,
        lastname: user.lastname,
        id: user.id,
      };
      const token = generateToken(payload);
      res.cookie("token", token);
      res.status(201).json({ message: "Logueo correcto", token });
    } catch (error) {
      res.status(error.code || 500).json({ message: error.message });
    }
  }

  static async secret(req: AuthRequest, res: Response) {
    res.json(req.user);
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
        return res.status(500).json({ message: "Error" });
      }
      const { email } = data.user;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Usuario no existe" });
      }
      user.verify = true;
      await user.save();
      res.status(200).json({ message: "Usuario verificado" });
    } catch (error) {
      res.status(error.code || 500).json({ message: error.message });
    }
  }
}

export default UserController;
