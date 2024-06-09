import { Types } from "mongoose";

export interface IMd {
  from: Types.ObjectId;
  to: Types.ObjectId;
  message: string;
  date: Date;
}
