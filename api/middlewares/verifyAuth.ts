import { NextFunction, Response } from "express";
import { validateToken } from "../config/token";
import { JwtPayload } from "jsonwebtoken";

const verifyAuth = (req: JwtPayload, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;
    if (!token) throw new Error("NO hay sesión existente");
    const payload = validateToken(token);
    req.user = payload;
    if (payload) return next();
  } catch (error) {
    res.status(403).json({ message: error });
  }
};

export default verifyAuth;
