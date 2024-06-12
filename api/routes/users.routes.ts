import { Router } from "express";
import { checkSchema } from "express-validator";
import { UserSchema } from "../schemas/UserSchema";
import validateFields from "../middlewares/validateFields";
import UserController from "../controllers/UserControllers";

const userRouter = Router();

userRouter.get("/", UserController.getUsers);
userRouter.post(
  "/",
  checkSchema(UserSchema),
  validateFields,
  UserController.addUser
);

export default userRouter;
