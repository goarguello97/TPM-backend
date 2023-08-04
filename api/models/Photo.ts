import { model, Schema } from "mongoose";

const PhotoSchema = new Schema({
  title: { type: String, require: true },
  imageUrl: { type: String, require: true },
});

export default model("Photo", PhotoSchema);
