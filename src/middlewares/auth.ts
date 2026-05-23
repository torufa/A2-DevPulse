import type { NextFunction, Request, Response } from "express";
import sendResponse from "../utils/sendResponse";
import jwt, { type JwtPayload } from "jsonwebtoken"
import config from "../config";
import { pool } from "../db";

type ROLES = "contributor" | "maintainer";

const auth = (...roles: ROLES[]) => {
    return async(req: Request, res: Response, next: NextFunction) => {
        try{
            const token = req.headers.authorization;

            if(!token) {
                return sendResponse(res, {
                  statusCode: 401,
                  success: false,
                  message: "Authorization token missing",
                  error: "NO_TOKEN",
                });
            }

            const decoded = jwt.verify(token, config.secretKey as string) as JwtPayload
            const userData = await pool.query(`
                SELECT * FROM users WHERE email = $1
            `,[decoded.email])

            const user = userData.rows[0]
            if(userData.rows.length === 0){
                return sendResponse(res, {
                  statusCode: 404,
                  success: false,
                  message: "User not found",
                  error: "USER_NOT_FOUND",
                });
            }

            if(roles.length && !roles.includes(user.role)){
                return sendResponse(res, {
                  statusCode: 403,
                  success: false,
                  message: "Forbidden: You don't have permission",
                  error: "FORBIDDEN_ROLE",
                });
            }

            req.user = decoded

            next()
        }catch(error){
            next(error)
        }
    }
}

export default auth;