import { Schema } from "express-validator";
import emailUnique from "../helpers/emailUnique";
import usernameUnique from "../helpers/userUnique";

export const UserSchema: Schema = {
  username: {
    notEmpty: { errorMessage: "El nombre de usuario es requerido." },
    isLength: {
      errorMessage: "Minimo 3 carácteres y máximo 30 carácteres.",
      options: { min: 3, max: 30 },
    },
    custom: { options: usernameUnique },
  },
  name: {
    optional: { options: { checkFalsy: true } },
    isLength: {
      errorMessage: "Minimo 3 carácteres y máximo 30 carácteres.",
      options: { min: 3, max: 30 },
    },
  },
  lastname: {
    optional: { options: { checkFalsy: true } },
    isLength: {
      errorMessage: "Minimo 3 carácteres y máximo 30 carácteres.",
      options: { min: 3, max: 30 },
    },
  },
  country: {
    optional: { options: { checkFalsy: true } },
    isLength: {
      errorMessage: "Minimo 3 carácteres y máximo 30 carácteres.",
      options: { min: 3, max: 30 },
    },
  },
  dateOfBirth: {
    optional: { options: { checkFalsy: true } },
    isDate: { errorMessage: "Porfavor ingrese una fecha válida." },
  },
  email: {
    notEmpty: { errorMessage: "El correo electrónico es obligatorio." },
    isEmail: { errorMessage: "Ingrese un correo electrónico válido." },
    custom: { options: emailUnique },
  },
  password: {
    notEmpty: { errorMessage: "La contraseña es requerida." },
    matches: {
      errorMessage:
        "Mínimo 8 caracteres, una mayúscula, un número y un carácter especial.",
      options: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
    },
    isLength: {
      errorMessage: "Mínimo 8 caracteres y máximo 30 caracteres.",
      options: { min: 8, max: 30 },
    },
  },
  skills: {
    optional: { options: { checkFalsy: true } },
    isArray: { errorMessage: "Introduzca los datos correctamente." },
  },
};
