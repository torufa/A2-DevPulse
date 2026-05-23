import config from "../../config";
import { pool } from "../../db";
import type { IUserSignup } from "./auth.interface";
import bcrypt from "bcrypt"

const userSignupIntoDB = async(payload: IUserSignup) => {
    const {name, email, password, role} = payload

    const hashedPassword = await bcrypt.hash(password, Number(config.PASSWORD_HASH_SALT))

    const result = await pool.query(`
        INSERT INTO users(name,email,password,role) VALUES ($1,$2,$3,$4)
        RETURNING id, name, email, role, created_at, updated_at
    `,[name, email,hashedPassword,role]);

    return result
}



export const authService = {
    userSignupIntoDB
}