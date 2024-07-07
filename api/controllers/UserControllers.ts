import { Request, Response } from "express";
import UserServices from "../services/UserServices";
import CustomError from "../helpers/customError";
import { FirebaseErrorCodes } from "../enum/firebaseCodesError";
import User from "../models/User";

export default class UserController {
  static async getUsers(req: Request, res: Response) {
    const { error, data } = await UserServices.getUsers();
    if (error) return res.status(400).json(error);

    res.status(200).json(data);
  }

  static async getById(req: Request, res: Response) {
    const { id } = req.params;
    const { error, data } = await UserServices.getById(id);
    if (error) return res.status(404).json(data);

    res.status(200).json(data);
  }

  static async addUser(req: Request, res: Response) {
    const { error, data } = await UserServices.addUser(req.body);
    if (error) return res.status(409).json(error);

    res.status(201).json(data);
  }

  static async putUser(req: Request, res: Response) {
    const { id } = req.params;
    const user = req.body;
    const { error, data } = await UserServices.putUser(id, user);
    if (error) return res.status(404).json(data);

    return res.status(200).json(data);
  }

  static async deleteUser(req: Request, res: Response) {
    const { idAdmin, idUserToDelete } = req.body;

    const { error, data } = await UserServices.deleteUser(
      idAdmin,
      idUserToDelete
    );
    if (error) return res.status(404).json(data);

    return res.status(200).json(data);
  }

  static async addAvatar(req: Request, res: Response) {
    const file = req.file;
    const { id } = req.body;

    if (!file) throw new CustomError("No ingreso una foto.", 404);

    const { error, data } = await UserServices.addAvatar(file, id);

    if (error) {
      return res.status(404).json(data);
    }

    return res.status(200).json(data);
  }

  static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const { error, data } = await UserServices.login(email, password);

    if (error) {
      if (data === FirebaseErrorCodes.INVALID_EMAIL) {
        return res.status(401).json({ message: "Credenciales inválidas." });
      }
      if (data === FirebaseErrorCodes.INVALID_PASSWORD) {
        return res.status(401).json({ message: "Credenciales inválidas." });
      }

      return res.status(401).json(data);
    }

    return res.status(200).json(data);
  }

  static async logout(req: Request, res: Response) {
    const { error, data } = await UserServices.logout();

    if (error) {
      return res.status(401).json(data);
    }

    return res.status(200).json(data);
  }

  static async verifyUser(req: Request, res: Response) {
    const { token } = req.params;

    const { error, data } = await UserServices.verifyUser(token);

    if (error) {
      return res.status(404).json(data);
    }

    return res.status(200).json(data);
  }

  static async recoverPassword(req: Request, res: Response) {
    const { email } = req.body;

    const { error, data } = await UserServices.recoverPassword(email);

    if (error) return res.status(404).json(data);

    return res.status(200).json(data);
  }

  static async authorizeChangePass(req: Request, res: Response) {
    const { token } = req.params;

    const { error, data } = await UserServices.authorizeChangePass(token);

    if (error) return res.status(404).json(data);

    return res.status(200).json(data);
  }
}
