import { Router } from "express";
import { issuesController } from "./issues.controller";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../../types";

const router = Router();
router.post('/', auth(), issuesController.createIssues);
router.get('/:id', issuesController.getSingleIssues);
router.get('/:id', issuesController.getAllIssues)
router.patch('/:id', auth(), issuesController.updateIssues)
router.delete('/:id', auth(USER_ROLE.maintainer), issuesController.deleteIssues)

export const issuesRoute = router;