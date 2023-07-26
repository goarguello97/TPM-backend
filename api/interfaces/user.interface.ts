import { Types } from "mongoose";

export interface userInterface {
  _id: string;
  username: string;
  name: string;
  lastname: string;
  email: string;
  password: string;
  mentor: [Types.ObjectId];
  role: Types.ObjectId;
  md: [Types.ObjectId];
  matchReq: [Types.ObjectId];
  matchSend: [Types.ObjectId];
  match: [Types.ObjectId];
  verify: boolean;
  skills: string[];
}
