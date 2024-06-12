import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import CustomError from "../helpers/customError";

class ValidationErrors {
  public service: Function;
  constructor() {
    this.service = validationResult;
  }
}

const validateFields = (req: Request, res: Response, next: NextFunction) => {
  const { errors } = new ValidationErrors().service(req);
  if (errors.length !== 0 && errors[0].path === "email") {
    if (errors[0].msg.includes("El correo electrónico es obligatorio.")) {
      return res
        .status(400)
        .json({ errorsLength: errors.length, error: errors[0].msg });
    }
    return res
      .status(409)
      .json({ errorsLength: errors.length, error: errors[0].msg });
  }
  if (errors.length !== 0 && errors[0].path === "username") {
    if (errors[0].msg.includes("El nombre de usuario es requerido.")) {
      return res
        .status(400)
        .json({ errorsLength: errors.length, error: errors[0].msg });
    }
    return res
      .status(409)
      .json({ errorsLength: errors.length, error: errors[0].msg });
  }
  if (errors.length !== 0)
    return res
      .status(400)
      .json({ errorsLength: errors.length, error: errors[0].msg });
  next();
};

export default validateFields;
