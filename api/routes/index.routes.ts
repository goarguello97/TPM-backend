import express from "express";
import rolesRouter from "./roles.routes";
import userRouter from "./users.routes";
import matchRouter from "./match.routes";

const router = express();

router.use("/role", rolesRouter);
router.use("/users", userRouter);
router.use("/match", matchRouter);

export default router;
