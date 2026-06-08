import type { Request, Response } from "express";
import { authService } from "./auth.service";

const signUp = async (req: Request, res: Response) => {
    try {
        const result = await authService.signUpIntoDB(req.body)
        res.status(201).json({
            success: true,
            message: "User Register Successfully",
            data: result.rows[0]
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "User register fail!",
            data: error
        })
    }
}
export const authController = {
    signUp
}