import { Types } from "mongoose";

export interface IMatch {
  user: Types.ObjectId;
  userMatch: Types.ObjectId;
  accepted: boolean;
}
