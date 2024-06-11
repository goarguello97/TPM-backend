import { Router } from "express";
import RoleController from "../controllers/RoleControllers";
const rolesRouter = Router();

rolesRouter.get("/", RoleController.getRoles);

export default rolesRouter;
