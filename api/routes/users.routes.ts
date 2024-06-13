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
userRouter.get("/:id", UserController.getById);
userRouter.put("/:id", UserController.putUser);
userRouter.delete("/", UserController.deleteUser);

export default userRouter;
