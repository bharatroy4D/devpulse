import type { Request, Response } from "express";
import { issuesService } from "./issues.service";
import type { JwtPayload } from "jsonwebtoken";

const createIssues = async (req: Request, res: Response) => {
    const reporterId = req.user.id;

    try {
        const result = await issuesService.createIssuesIntoDB(req.body, reporterId)
        res.status(201).json({
            success: true,
            message: "issues Create successfully",
            data: result.rows[0]
        })
    } catch (error) {
        res.status(500).json({
            success: true,
            message: "Failed to Create issues ",
            error: error
        })
    }
};
const getSingleIssues = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await issuesService.getSingleIssuesIntoDB(id as string)
        res.status(201).json({
            success: true,
            message: "issues Create successfully",
            data: result
        })
    } catch (error) {
        res.status(500).json({
            success: true,
            message: "Failed to Create issues ",
            error: error
        })
    }
}

export const issuesController = {
    createIssues, getSingleIssues
}