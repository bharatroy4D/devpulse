import type { Request, Response } from "express";
import { issuesService } from "./issues.service";

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
const getAllIssues = async (req: Request, res: Response) => {
    try {
        const { sort, type, status } = req.query;

        const result = await issuesService.getAllIssuesIntoDB(
            sort as string,
            type as string,
            status as string
        )

        res.status(200).json({
            success: true,
            message: "issues retrived successfully",
            data: result
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failt to retrived issues! ",
            error: error
        })
    }
}
const updateIssues = async (req: Request, res: Response) => {
    try {
        const issuesId = req.params.id;

        const result = await issuesService.updateIssuesIntoDB(issuesId as string, req.body, req.user!);
        res.status(200).json({
            success: true,
            message: "issues update successfully",
            data: result.rows[0]
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "something went wrong! ",
            error: error
        })
    }

};
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
    deleteIssues, updateIssues, getAllIssues
}