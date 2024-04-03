export interface ProductType{
    id? : number;
    groupCode?: number;
    groupName?: string; 
    totalCount?: number 
 }


 export interface productTypeResponse{
    responseData?:ProductType[],
    errCode: number,
    message: string
 }
