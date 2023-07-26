import { Router } from "express";
import MatchController from "../controllers/match.controllers";
const matchRouter = Router();

matchRouter.post("/", MatchController.matchRequest);
matchRouter.post("/response", MatchController.matchResponse);

export default matchRouter;
