import { pool } from "../../db";

const createIssuesIntoDB = async (payload: any, reporterId: number) => {
    const { title, description, type } = payload;

    const result = await pool.query(
        `
    INSERT INTO issues(
    title, description,
    type , reporter_id)
    VALUES($1, $2, $3, $4)
    RETURNING *
    `, [title, description, type, reporterId])
    return result;

}
export const issuesService = {
    createIssuesIntoDB
}