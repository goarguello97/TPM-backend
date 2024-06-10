import { Router } from "express";
import RoleController from "../controllers/roles";
const rolesRouter = Router();

rolesRouter.get("/", RoleController.getRoles);

export default rolesRouter;
