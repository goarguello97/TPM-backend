import { model, Schema } from "mongoose";
import { IMatch } from "../interfaces/IMatch";

const MatchSchema = new Schema<IMatch>(
  {
    //Aca van nuestros datos para que el solicitado sepa quien le matchea.
    user: { type: Schema.Types.ObjectId, ref: "User", require: true },
    userMatch: { type: Schema.Types.ObjectId, ref: "User", require: true },
    accepted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("Match", MatchSchema);
