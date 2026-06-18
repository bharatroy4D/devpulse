import type { ILoginUser, ISignupUser } from "./auth.interface";
export declare const authService: {
    signUpIntoDB: (payload: ISignupUser) => Promise<import("pg").QueryResult<any>>;
    loginIntoDB: (payload: ILoginUser) => Promise<{
        accessToken: string;
    }>;
};
//# sourceMappingURL=auth.service.d.ts.map