import { Types } from "mongoose";

export interface IUser {
  _id: string;
  username: string;
  name: string;
  lastname: string;
  country: string;
  dateOfBirth: string;
  email: string;
  password: string;
  mentor: Types.ObjectId[];
  role: Types.ObjectId;
  md: Types.ObjectId[];
  matchReq: Types.ObjectId[];
  matchSend: Types.ObjectId[];
  match: Types.ObjectId[];
  verify: boolean;
  skills: string[];
  avatar: Types.ObjectId;
  tokenRecover: string;
}
