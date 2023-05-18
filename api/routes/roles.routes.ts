import { Router } from "express";
import RolesController from "../controllers/roles.controllers";
const rolesRouter = Router();

rolesRouter.get("/", RolesController.getRoles);

export default rolesRouter;
