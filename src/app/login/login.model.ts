export interface Login {
    username: string,
    password: string,
    token?: string
}


export interface LoginResponse {
    responseData: Login[],
    errCode: number,
    message: string
}