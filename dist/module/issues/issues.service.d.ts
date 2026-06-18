import type { JwtPayload } from "jsonwebtoken";
import type { ICreateIssues, IUpdatedIssues } from "./issues.interface";
export declare const issuesService: {
    createIssuesIntoDB: (payload: ICreateIssues, reporterId: number) => Promise<import("pg").QueryResult<any>>;
    getSingleIssuesIntoDB: (id: string) => Promise<import("pg").QueryResult<any>>;
    updateIssuesIntoDB: (issuesId: string, payload: IUpdatedIssues, user: JwtPayload) => Promise<import("pg").QueryResult<any>>;
    deleteIssuesIntoDB: (id: string) => Promise<import("pg").QueryResult<any>>;
    getAllIssuesIntoDB: (sort?: string, type?: string, status?: string) => Promise<void>;
};
//# sourceMappingURL=issues.service.d.ts.map