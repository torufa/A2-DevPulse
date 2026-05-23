import { Router } from "express";
import { authController } from "./auth.controller";

const authRouter = Router()

authRouter.post("/signup", authController.userSignup);

export default authRouter;