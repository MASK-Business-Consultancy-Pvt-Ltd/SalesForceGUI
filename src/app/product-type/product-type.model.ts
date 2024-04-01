export interface ProductType{
    id? : number;
    groupCode?: number;
    groupName?: string;  
 }


 export interface responseData{
    groupCode: number,
    groupName: string,
    totalCount: number
 }

 export interface productTypeResponse{
    responseData?:responseData[],
    errCode: number,
    message: string
 }
