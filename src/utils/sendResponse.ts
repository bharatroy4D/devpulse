import type { Response } from "express";

interface TResponse<T> {
    success: boolean,
    message: string,
    data?: T
}
const sendResponse = <T>(
    res: Response,
    statusCode: number,
    data: TResponse<T> ) => {
    res.status(statusCode).json(data)
}
export default sendResponse;