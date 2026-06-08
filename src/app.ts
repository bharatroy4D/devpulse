import express, { type Application, type Request, type Response } from "express";
import { route } from "./module/auth/auth.route";
const app: Application = express();
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send("hello devpluse")
})
app.use('/api/auth', route)

export default app;