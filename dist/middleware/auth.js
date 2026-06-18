import jwt, {} from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";
const auth = (...roles) => {
    return async (req, res, next) => {
        try {
            const token = req.headers.authorization;
            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized access!"
                });
            }
            const decoded = jwt.verify(token, config.jwt_secrete);
            const userData = await pool.query(`
            SELECT * FROM users WHERE email=$1
            `, [decoded.email]);
            const user = userData.rows[0];
            if (roles.length && !roles.includes(user.role)) {
                return res.status(403).json({
                    success: false,
                    message: "forbidden"
                });
            }
            req.user = decoded;
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
export default auth;
//# sourceMappingURL=auth.js.map