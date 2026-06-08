import app from "./app";
import config from "./config";
import { initDB } from "./db";

app.listen(config.port, () => {
    initDB()
    console.log(`server is running port:${config.port}`);
})