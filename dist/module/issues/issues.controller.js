import { issuesService } from "./issues.service";
import sendResponse from "../../utils/sendResponse";
const createIssues = async (req, res) => {
    const reporterId = req.user.id;
    try {
        const result = await issuesService.createIssuesIntoDB(req.body, reporterId);
        sendResponse(res, 201, {
            success: true,
            message: "issues Create successfully",
            data: result.rows[0]
        });
    }
    catch (error) {
        sendResponse(res, 500, {
            success: true,
            message: "Failed to Create issues ",
            data: error
        });
    }
};
const getSingleIssues = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await issuesService.getSingleIssuesIntoDB(id);
        if (result.rows.length === 0) {
            res.status(500).json({
                success: false,
                message: "issues not found! ",
                data: {}
            });
        }
        sendResponse(res, 200, {
            success: true,
            message: "issues retrived successfully",
            data: result.rows[0]
        });
    }
    catch (error) {
        sendResponse(res, 500, {
            success: false,
            message: "issues not found! ",
            data: error
        });
    }
};
const getAllIssues = async (req, res) => {
    try {
        const { sort, type, status } = req.query;
        const result = await issuesService.getAllIssuesIntoDB(sort, type, status);
        res.status(200).json({
            success: true,
            message: "issues retrived successfully",
            data: result
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failt to retrived issues! ",
            error: error
        });
    }
};
const updateIssues = async (req, res) => {
    try {
        const issuesId = req.params.id;
        const result = await issuesService.updateIssuesIntoDB(issuesId, req.body, req.user);
        sendResponse(res, 200, {
            success: true,
            message: "issues update successfully",
            data: result.rows[0]
        });
    }
    catch (error) {
        sendResponse(res, 500, {
            success: false,
            message: "something went wrong! ",
            data: error
        });
    }
};
const deleteIssues = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await issuesService.deleteIssuesIntoDB(id);
        sendResponse(res, 200, {
            success: true,
            message: "issues delete successfully",
            data: {}
        });
    }
    catch (error) {
        sendResponse(res, 500, {
            success: false,
            message: "issues delete fail!",
            data: error
        });
    }
};
export const issuesController = {
    createIssues, getSingleIssues,
    deleteIssues, updateIssues, getAllIssues
};
//# sourceMappingURL=issues.controller.js.map