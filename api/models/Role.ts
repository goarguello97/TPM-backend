import { model, Schema } from "mongoose";

const RoleSchema = new Schema(
  {
    role: String,
  },
  {
    versionKey: false,
  }
);

export default model("Role", RoleSchema);