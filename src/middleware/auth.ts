import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";

const auth = (...roles: any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization;
            if (!token) {
                res.status(401).json({
                    success: false,
                    message: "Unauthorized access!"
                })
            }
            const decoded = jwt.verify(token as string, config.jwt_secrete as string) as JwtPayload;
            const userData = await pool.query(`
            SELECT * FROM users WHERE email=$1
            `, [decoded.email]);
            const user = userData.rows[0];

            if (roles.length && !roles.includes(user.role)) {
                res.status(403).json({
                    success: false,
                    message: "forbidden"
                })
            }
            req.user = decoded

            next();

        } catch (error) {
            next(error)
        }
    }
}
export default auth;