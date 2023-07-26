import { NextFunction } from "express";
import mongoose, { model, Schema, Types } from "mongoose";
import bcrypt from "bcrypt";

const salt = bcrypt.genSaltSync(10);

const UserSchema = new Schema(
  {
    username: { type: String, require: true, unique: true },
    name: { type: String, require: true },
    lastname: { type: String, require: true },
    country: String,
    dateOfBirth: Date,
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    mentor: [{ type: Schema.Types.ObjectId, ref: "User" }],
    role: { type: Schema.Types.ObjectId, required: true, ref: "Role" },
    md: [{ type: Schema.Types.ObjectId, ref: "MD" }],
    matchReq: [{ type: Schema.Types.ObjectId, ref: "User" }],
    matchSend: [{ type: Schema.Types.ObjectId, ref: "User" }],
    match: [{ type: Schema.Types.ObjectId, ref: "User" }],
    verify: { type: Boolean, default: false },
    token: String,
    skills: [String],
    avatar: String,
  },
  {
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
