import { Schema } from "express-validator";
import emailUnique from "../helpers/emailUnique";
import usernameUnique from "../helpers/userUnique";

export const user: Schema = {
  username: {
    notEmpty: { errorMessage: "Username is required" },
    isLength: {
      errorMessage: "Minimum 3 characters and maximum 30 characters",
      options: { min: 3, max: 30 },
    },
    custom: { options: usernameUnique },
  },
  name: {
    optional: { options: { checkFalsy: true } },
    isLength: {
      errorMessage: "Minimum 3 characters and maximum 30 characters",
      options: { min: 3, max: 30 },
    },
  },
  lastname: {
    optional: { options: { checkFalsy: true } },
    isLength: {
      errorMessage: "Minimum 3 characters and maximum 30 characters",
      options: { min: 3, max: 30 },
    },
  },
  country: {
    optional: { options: { checkFalsy: true } },
    isLength: {
      errorMessage: "Minimum 3 characters and maximum 30 characters",
      options: { min: 3, max: 30 },
    },
  },
  dateOfBirth: {
    optional: { options: { checkFalsy: true } },
    isDate: { errorMessage: "Please enter a valid date" },
  },
  email: {
    notEmpty: { errorMessage: "Email is required" },
    isEmail: { errorMessage: "Enter a valid email" },
    custom: { options: emailUnique },
  },
  password: {
    matches: {
      errorMessage:
        "Minimum 8 characters, one uppercase, one number and one special character",
      options: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
    },
  },
  skills: {
    optional: { options: { checkFalsy: true } },
    isArray: { errorMessage: "Enter the data correctly" },
  },
};
