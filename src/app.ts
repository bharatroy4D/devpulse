import express, { type Application, type Request, type Response } from "express";
import { issuesRoute } from "./module/issues/issues.route";
import { authRoute } from "./module/auth/auth.route";
import cors from "cors"
const app: Application = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5000',

}))

app.get('/', (req: Request, res: Response) => {
    res.send("hello devpluse")
})
app.use('/api/auth', authRoute);
app.use('/api/issues', issuesRoute)

export default app;