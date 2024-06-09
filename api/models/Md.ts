import { model, Schema } from "mongoose";
import { IMd } from "../interfaces/IMd";

const MdSchema = new Schema<IMd>(
  {
    from: { type: Schema.Types.ObjectId, ref: "User", required: true },
    to: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, require: true },
    date: { type: Date, require: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("MD", MdSchema);
