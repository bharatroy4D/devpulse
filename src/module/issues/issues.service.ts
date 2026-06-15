import type { JwtPayload } from "jsonwebtoken";
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
};
const updateIssuesIntoDB = async (
  issuesId: string,
  payload: {
    title?: string,
    description?: string,
    type?: "bug" | "feature_request"
  },
  user: JwtPayload
) => {
  const issuesResult = await pool.query(`
    SELECT * FROM issues WHERE id=$1
    `, [issuesId])
  const issues = issuesResult.rows[0];
  if (!issues) {
    throw new Error("issues not found!")
  }
  if (user.role === "contributor") {
    if (issues.reporter_id !== user.id) {
      throw new Error(`
        statusCode:403,
        message:"you can update only your own issues"
        `)
    }
  }
  if (issues.status !== "open") {
    throw new Error(`
      statusCode:409,
      message:"only open issues can be updated"
      `)
  }

  const title = payload.title ?? issues.title;
  const description = payload.description ?? issues.description;
  const type = payload.type ?? issues.type;

  const result = await pool.query(`
    UPDATE issues SET
     title=$1,
    description=$2,
    type=$3,
    updated_at=NOW() 
    WHERE id=$4

    RETURNING *
    `, [title, description, type, issuesId])
  return result;

}
const deleteIssuesIntoDB = async (id: string) => {
  const result = await pool.query(`
    DELETE FROM issues WHERE id=$1
    
    `, [id])
  if (result.rowCount === 0) {
    throw new Error('issues not found')
  }
  return result;
}
export const issuesService = {
  createIssuesIntoDB,
  getSingleIssuesIntoDB,
  updateIssuesIntoDB,
  deleteIssuesIntoDB
}