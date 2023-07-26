import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../interfaces/requestInterface";
import Role from "../models/Role";
import User from "../models/User";

const verifyAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id);
    const role = await Role.findOne({ role: "ADMIN" });
    if (user.role === role._id) {
      next();
    } else {
      throw new Error("Falla en los permisos");
    }
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};

export default verifyAdmin;