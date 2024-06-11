import express from "express";
import rolesRouter from "./roles.routes";
import userRouter from "./users.routes";

const router = express();

router.use("/role", rolesRouter);
router.use("/users", userRouter);

export default router;
