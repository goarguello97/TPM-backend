import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface IPayload {
  email: string;
  name: string;
  lastname: string;
  id: string;
  role: string;
  dateOfBirth: string;
  avatar: string;
}
