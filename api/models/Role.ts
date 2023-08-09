import { model, Schema } from "mongoose";

const RoleSchema = new Schema(
  {
    role: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("Role", RoleSchema);