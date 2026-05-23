import { Router } from "express";
import { authController } from "./auth.controller";

const authRouter = Router()

authRouter.post("/signup", authController.userSignup);
authRouter.post("/login", authController.userLogin);

export default authRouter;