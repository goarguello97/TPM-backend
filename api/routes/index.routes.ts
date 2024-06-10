import express from "express";
import rolesRouter from "./roles.routes";

const router = express();

router.use("/role", rolesRouter);

export default router;
