import { Router } from "express";
import MatchController from "../controllers/MatchControllers";
const matchRouter = Router();

matchRouter.post("/send", MatchController.match);

export default matchRouter;
