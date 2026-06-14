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

};
const getSingleIssuesIntoDB = async (id: string) => {
    // const result = await pool.query(`
    // SELECT * FROM issues WHERE id=$1

    // `, [id])
    // return result;
    const result = await pool.query(`
  SELECT
    i.id,
    i.title,
    i.description,
    i.type,
    i.status,
    i.created_at,
    i.updated_at,
    json_build_object(
      'id', u.id,
      'name', u.name,
      'role', u.role
    ) AS reporter
  FROM issues i
  JOIN users u
    ON i.reporter_id = u.id
  WHERE i.id = $1
  `, [id]);

    return result;
}
const deleteIssuesIntoDB = async (id: string) => {
    const result = await pool.query(`
    SELECT * FROM issues WHERE id=$1
    
    `, [id])
}
export const issuesService = {
    createIssuesIntoDB, getSingleIssuesIntoDB,
    deleteIssuesIntoDB
}