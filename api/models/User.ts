import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import { IUser } from "../interfaces/IUser";

const salt = bcrypt.genSaltSync(10);

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, require: true, unique: true },
    name: { type: String },
    lastname: { type: String },
    country: String,
    dateOfBirth: String,
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    mentor: [{ type: Schema.Types.ObjectId, ref: "User" }],
    role: { type: Schema.Types.ObjectId, ref: "Role" },
    md: [{ type: Schema.Types.ObjectId, ref: "MD" }],
    matchReq: [{ type: Schema.Types.ObjectId, ref: "User" }],
    matchSend: [{ type: Schema.Types.ObjectId, ref: "User" }],
    match: [{ type: Schema.Types.ObjectId, ref: "User" }],
    verify: { type: Boolean, default: false },
    skills: [String],
    avatar: {
      type: Schema.Types.ObjectId,
      ref: "Photo",
    },
    tokenRecover: { type: String, default: "" },
  },
  {
    timestamps: true,
    methods: {
      hash(password: string, salt: string) {
        return bcrypt.hashSync(password, salt);
      },
      validatePassword(entryPass: string) {
        return bcrypt.compareSync(entryPass, this.password);
      },
    },
    versionKey: false,
  }
);

export default model("User", UserSchema);
