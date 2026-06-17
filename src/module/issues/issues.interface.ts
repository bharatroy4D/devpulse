export interface ICreateIssues {
    title: string,
    description: string,
    type: "bug" | "feature_request"
}
export interface IUpdatedIssues {
    title?: string,
    description?: string,
    type?: "bug" | "feature_request"
}