import jwt, { JsonWebTokenError } from "jsonwebtoken";
import dotenv from "dotenv";
import { IPayload } from "../interfaces/IPayload";
import { IUser } from "../interfaces/IUser";

dotenv.config();

const SECRET = process.env.SECRET as string;

export function generateToken(payload: IUser) {
  const token = jwt.sign({ user: payload }, SECRET, { expiresIn: "1h" });
  return token;
}

export function generateTokenRegister(payload: IUser) {
  const token = jwt.sign({ user: payload }, SECRET, { expiresIn: "10h" });
  return token;
}

export function generateTokenRecover(payload: IUser) {
  const token = jwt.sign({ user: payload }, SECRET, { expiresIn: "10h" });
  return token;
}

export function dataToken(token: string): { user: IUser } | null {
  let data: { user: IUser } | null = null;
  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      if (err instanceof JsonWebTokenError) {
        return {
          error: true,
          data: { code: 404, message: "Token inválido." },
        };
      }
    } else {
      data = decoded as { user: IUser };
    }
  });
  return data;
}

export function validateToken(token: string) {
  return jwt.verify(token, SECRET);
}
