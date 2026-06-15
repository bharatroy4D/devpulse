import type { Request, Response } from "express";
import { issuesService } from "./issues.service";
import type { JwtPayload } from "jsonwebtoken";
import { Result } from "pg";
import { pool } from "../../db";

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
        if (result.rows.length === 0) {
            res.status(500).json({
                success: false,
                message: "issues not found! ",
                data: {}
            })
        }
        res.status(200).json({
            success: true,
            message: "issues retrived successfully",
            data: result.rows[0]
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "issues not found! ",
        })
    }
};
const updateIssues = async (req: Request, res: Response) => {
    try {
        const result = await issuesService.updateIssuesIntoDB();
        res.status(200).json({
            success: true,
            message: "issues update successfully",
            data: Result
        })
    } catch (error) {
        res.status(500).json({
            success: true,
            message: "issues update ",
            error: error
        })
    }

}

const deleteIssues = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await issuesService.deleteIssuesIntoDB(id as string)

        res.status(200).json({
            success: true,
            message: "issues delete successfully",
            data: {}
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error
        })
    }
}

export const issuesController = {
    createIssues, getSingleIssues,
    deleteIssues, updateIssues
}