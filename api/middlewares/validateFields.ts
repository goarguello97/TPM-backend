import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

class ValidationErrors {
  public service: Function;
  constructor() {
    this.service = validationResult;
  }
}

const validateFields = (req: Request, res: Response, next: NextFunction) => {
  const { errors } = new ValidationErrors().service(req);
  if (errors.length !== 0)
    return res
      .status(400)
      .json({ errorsLength: errors.length, error: errors[0].msg });
  next();
};

export default validateFields;
