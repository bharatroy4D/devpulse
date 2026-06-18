import express, {} from "express";
import { issuesRoute } from "./module/issues/issues.route";
import { authRoute } from "./module/auth/auth.route";
import cors from "cors";
import globalErrorHandler from "./utils/globalErrorHandler";
const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5000',
}));
app.get('/', (req, res) => {
    res.send("hello devpluse");
});
app.use('/api/auth', authRoute);
app.use('/api/issues', issuesRoute);
app.use(globalErrorHandler);
export default app;
//# sourceMappingURL=app.js.map