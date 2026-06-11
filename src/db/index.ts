import { Pool } from "pg"
import config from "../config"

export const pool = new Pool({
    connectionString: config.databse_string
})
export const initDB = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            name VARCHAR(20) NOT NULL,
            email VARCHAR(40) UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role VARCHAR(20) 
            CHECK(role IN('contributor','maintainer'))
            DEFAULT ('contributor'),

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS issues(
            id SERIAL PRIMARY KEY,
            title VARCHAR(150) NOT NULL,
            description TEXT NOT NULL,
            type VARCHAR(30)
            CHECK(type IN('bug', 'feature_request'))
            NOT NULL,
            status VARCHAR(20)
            DEFAULT 'open'
            CHECK (status IN('open', 'in_progress', 'resolved')),
            reporter_id INTEGER NOT NULL REFERENCES users(id),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`)

        console.log("Database connection successfully");
    } catch (error) {
        console.log("DB error", error);
    }
}