import { Action } from "rxjs/internal/scheduler/Action";

export interface CustomerType{

    code?:number,
    name?:string,
    totalCount?:number
    type?:string
      
 }

 export interface CustomerTypeResponse{
    responseData:CustomerType[],
    errCode: number,
    message: string
 }
