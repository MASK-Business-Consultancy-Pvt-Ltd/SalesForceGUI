export interface WorkingType {
    code?: string,
    name?: string,
    u_Active?: string,
    totalCount?: number
}

// same for all
export interface WorkingTypeResponse {
    responseData: WorkingType[],
    errCode: number,
    message: string
}