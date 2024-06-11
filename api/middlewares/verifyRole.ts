import { NextFunction, Response } from "express";
import { IRequest } from "../interfaces/IRequest";
import Role from "../models/Role";
import User from "../models/User";

const verifyAdmin = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id);
    const role = await Role.findOne({ role: "ADMIN" });
    if (user && role) {
      if (user.role === role._id) {
        next();
      } else {
        throw new Error("Falla en los permisos.");
      }
    }
  } catch (error) {
    return res.status(403).json({ message: error });
  }
};

export default verifyAdmin;
