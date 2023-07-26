import { model, Schema, Types } from "mongoose";

interface Match {
  user: Types.ObjectId;
  userMatch: Types.ObjectId;
  accepted: boolean;
}

const MatchSchema = new Schema<Match>(
  {
    //Aca van nuestros datos para que el solicitado sepa quien le matchea.
    user: { type: Schema.Types.ObjectId, ref: "User", require: true },
    userMatch: { type: Schema.Types.ObjectId, ref: "User", require: true },
    accepted: { type: Boolean, default: false },
  },
  { versionKey: false }
);

export default model("Match", MatchSchema);
