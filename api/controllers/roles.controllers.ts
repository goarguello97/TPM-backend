import { Request, Response } from "express";
import Role from "../models/Role";

class RolesController {
  static async getRoles(req: Request, res: Response) {
    try {
      const roles = await Role.find();
      res.status(200).json(roles);
    } catch (error) {
      res.status(error.code || 500).json({ message: error.message });
    }
  }
}

export default RolesController;
