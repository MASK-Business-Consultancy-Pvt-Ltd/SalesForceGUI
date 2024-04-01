export interface EmployeeLevel {
    positionID?: number,
    name: string,
    description: string,
    totalCount?: number
}

export interface EmployeeLevelResponse {
    responseData: EmployeeLevel[],
    errCode: number,
    message: string
}