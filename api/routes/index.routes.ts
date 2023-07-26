import { Router } from "express";
import userRouter from "./user.routes";
import matchRouter from "./match.routes";
import rolesRouter from "./roles.routes";
const router = Router();

router.use("/users", userRouter);
router.use("/match", matchRouter);
router.use("/roles", rolesRouter);

export default router;
