import { model, Schema } from "mongoose";
import { IRole } from "../interfaces/IRole";

const RoleSchema = new Schema<IRole>(
  {
    role: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("Role", RoleSchema);
