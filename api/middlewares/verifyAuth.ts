import { NextFunction, Request, Response } from "express";
import { validateToken } from "../config/token";
import CustomError from "../helpers/customError";
import { AuthRequest } from "../interfaces/requestInterface";

const verifyAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;
    if (!token) throw new CustomError("No hay sesión existente", 401);
    const payload = validateToken(token);
    req.user = payload;
    if (payload) return next();
  } catch (error) {
    const { message } = error;
    res.status(403).json(message);
  }
};

export default verifyAuth;
