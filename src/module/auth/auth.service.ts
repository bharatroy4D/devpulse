import bcrypt from "bcryptjs";
import { pool } from "../../db";
import jwt from "jsonwebtoken";
import config from "../../config";

const signUpIntoDB = async (payload: any) => {
    const { name, password, email, role } = payload;
    const hashPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(`
        INSERT INTO users
        (name, password, email,role)
        VALUES($1, $2, $3, COALESCE($4, 'contributor'))
        RETURNING *
        `, [name, hashPassword, email, role])
    delete result.rows[0].password
    return result;
};

const loginIntoDB = async (payload: { email: string, password: string }) => {
    const { email, password } = payload;
    const result = await pool.query(`
        SELECT * FROM users WHERE email=$1
        `, [email])
    if (result.rows.length === 0) {
        throw new Error("User not found!")
    }
    const user = result.rows[0];
    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
        throw new Error("Invalid Crediential")
    }
    const jwtPayload = {
        id: user.id,
        name: user.name,
        role: user.role
    }
    const accessToken = await jwt.sign(jwtPayload, config.jwt_secrete as string, { expiresIn: "1d" })
    return { accessToken }
}

export const authService = {
    signUpIntoDB, loginIntoDB
}