import dotenv from "dotenv";
import path from "path"

dotenv.config({
    path: path.join(process.cwd(), ".env")
})
const config = {
    databse_string: process.env.DATABASE_URL,
    port: process.env.PORT
}
export default config;