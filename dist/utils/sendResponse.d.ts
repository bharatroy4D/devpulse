import type { Response } from "express";
interface TResponse<T> {
    success: boolean;
    message: string;
    data?: T;
}
declare const sendResponse: <T>(res: Response, statusCode: number, data: TResponse<T>) => void;
export default sendResponse;
//# sourceMappingURL=sendResponse.d.ts.map