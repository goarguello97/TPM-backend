import { Request, Response } from "express";
import UserServices from "../services/UserServices";

export default class UserController {
  static async getUsers(req: Request, res: Response) {
    const { error, data } = await UserServices.getUsers();
    if (error) return res.status(400).json(error);

    res.status(200).json(data);
  }

  static async getById(req: Request, res: Response) {
    const { id } = req.params;
    const { error, data } = await UserServices.getById(id);
    if (error) return res.status(400).json(error);

    res.status(200).json(data);
  }

  static async addUser(req: Request, res: Response) {
    const { error, data } = await UserServices.addUser(req.body);
    if (error) return res.status(400).json(error);

    res.status(201).json(data);
  }
}
