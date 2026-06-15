import { Router } from "express";
import { issuesController } from "./issues.controller";
import auth from "../../middleware/auth";

const router = Router();
router.post('/', auth(), issuesController.createIssues);
router.get('/:id', issuesController.getSingleIssues);
router.patch('/:id', issuesController.updateIssues)
router.delete('/:id', auth('maintainer'), issuesController.deleteIssues)

export const issuesRoute = router;