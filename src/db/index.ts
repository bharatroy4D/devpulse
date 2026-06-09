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
            name VARCHAR(20),
            email VARCHAR(20) UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role VARCHAR(20) 
            CHECK(role IN('contributor','maintainer'))
            DEFAULT ('contributor'),

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`)
            
        console.log("Database connection successfully");
    } catch (error) {
        console.log("DB error", error);
    }
}