export interface ExpenseHead {
    code?: string,
    name?: string,
    u_Active?: string,
    totalCount?: number
}

export interface ExpenseHeadResponse {
    responseData: ExpenseHead[],
    errCode: number,
    message: string
}