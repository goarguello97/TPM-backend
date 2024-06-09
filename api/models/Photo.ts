import { model, Schema } from "mongoose";
import { IPhoto } from "../interfaces/IPhoto";

const PhotoSchema = new Schema<IPhoto>(
  {
    title: { type: String, require: true },
    imageUrl: { type: String, require: true },
  },
  {
    timestamps: true,
  }
);

export default model("Photo", PhotoSchema);
