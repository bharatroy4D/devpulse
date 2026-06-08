import bcrypt from "bcryptjs";
import { pool } from "../../db";

const signUpIntoDB = async (payload: any) => {
    const { name, password, email, role } = payload;
    const hashPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(`
        INSERT INTO users
        (name, password, email,role)
        VALUES($1, $2, COALESCE($3, 'contributor'), $4)
        RETURNING *
        `, [name, hashPassword, email, role])
    delete result.rows[0].password
    return result;
}
export const authService = {
    signUpIntoDB
}