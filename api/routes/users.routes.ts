import { Router } from "express";
import UserController from "../controllers/UserControllers";

const userRouter = Router();

userRouter.get("/", UserController.getUsers);
userRouter.post("/", UserController.addUser);

export default userRouter;
