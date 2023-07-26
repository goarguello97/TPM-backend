import { Router } from "express";
import MatchController from "../controllers/match.controllers";
const matchRouter = Router();

matchRouter.post("/", MatchController.matchRequest);

export default matchRouter;
