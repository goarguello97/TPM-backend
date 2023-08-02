import { Router } from "express";
import { checkSchema } from "express-validator";
import validateFields from "../middlewares/validateFields";
import { user } from "../schemas/UserSchema";
const userRouter = Router();
import UserController from "../controllers/user.controllers";
import verifyAuth from "../middlewares/verifyAuth";

userRouter.post(
  "/register",
  checkSchema(user),
  validateFields,
  UserController.addUser
);
userRouter.get("/user", UserController.getUser);
userRouter.get("/", UserController.getUsers);
userRouter.put("/update", UserController.updateUser);
userRouter.delete("/delete", UserController.deleteUser);
userRouter.post("/login", UserController.loginUser);
userRouter.get("/me", verifyAuth, UserController.secret);
userRouter.post("/logout", UserController.logoutUser);
userRouter.get("/verify/:token", UserController.verifyUser);
userRouter.post("/recover-pass", UserController.recoverPassword)
userRouter.get("/access-pass/:token", UserController.authorizeChangePassword)
userRouter.patch("/change-pass", UserController.updatePassword)

export default userRouter;
