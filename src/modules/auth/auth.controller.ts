import type { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { authService } from "./auth.service";

const userSignup = async(req:Request, res: Response) => {
    try{
        const result = await authService.userSignupIntoDB(req.body)
        sendResponse(res, {
          statusCode: 201,
          success: true,
          message: "User registered successfully",
          data: result.rows[0]
        });
    }catch(error){
        sendResponse(res, {
          statusCode: 500,
          success: false,
          message: "Signup failed!",
          error: error,
        });
    }
}

const userLogin = async(req: Request, res: Response) => {
    try{
        const result = await authService.userLoginIntoDb(req.body);
        sendResponse(res, {
          statusCode: 200,
          success: true,
          message: "Login successful",
          data: result
        });
    }catch(error){
        sendResponse(res, {
          statusCode: 401,
          success: false,
          message: "Unauthorized",
          error: error,
        });
    }
}

export const authController = {
    userSignup,
    userLogin
}