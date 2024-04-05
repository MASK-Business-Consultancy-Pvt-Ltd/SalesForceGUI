export interface ExpenseMaster {
    code: string,
    u_Desgn: string,
    u_DA_Local: number,
    u_DA_Outstn: number,
    u_TA_Local: number,
    u_TA_Outstn: number
    totalCount?:number
}

export interface ExpenseResponse {
    responseData: ExpenseMaster[],
    errCode: number,
    message: string
}