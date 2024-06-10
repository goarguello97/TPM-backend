import { Request, Response } from "express";
import RoleService from "../services/roles";

export default class RoleController {
  static async getRoles(req: Request, res: Response) {
    const { error, data } = await RoleService.getRoles();
    if (error) return res.status(400).json(error);

    res.status(200).json(data);
  }
}
