import { Router } from "express";
import { checkSchema } from "express-validator";
import { UserSchema } from "../schemas/UserSchema";
import validateFields from "../middlewares/validateFields";
import UserController from "../controllers/UserControllers";
import { upload } from "../config/firebase";

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
userRouter.patch(
  "/add/avatar",
  upload.single("image"),
  UserController.addAvatar
);
userRouter.post("/login", UserController.login);
userRouter.post("/logout", UserController.logout);
userRouter.get("/verify/:token", UserController.verifyUser);
userRouter.post("/recover-pass", UserController.recoverPassword);

export default userRouter;
