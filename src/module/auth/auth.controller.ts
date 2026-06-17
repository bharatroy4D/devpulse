import type { Request, Response } from "express";
import { authService } from "./auth.service";
import sendResponse from "../../utils/sendResponse";

const signUp = async (req: Request, res: Response) => {
    try {
        const result = await authService.signUpIntoDB(req.body)
        sendResponse(res, 201, {
            success: true,
            message: "User Register Successfully",
            data: result.rows[0]
        })
    } catch (error) {
        sendResponse(res, 500, {
            success: false,
            message: "User Register fail!",
            data: error
        })
    }
}
const login = async (req: Request, res: Response) => {
    try {
        const result = await authService.loginIntoDB(req.body)
        sendResponse(res, 200, {
            success: true,
            message: "Login Successfully",
            data: result
        })
    } catch (error) {
        sendResponse(res, 500, {
            success: true,
            message: "Something went worng",
            data: error
        })
    }
}
export const authController = {
    signUp, login
}