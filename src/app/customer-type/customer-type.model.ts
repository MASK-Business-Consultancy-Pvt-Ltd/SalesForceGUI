import { Action } from "rxjs/internal/scheduler/Action";

export interface CustomerType{

    id? : number;
    customerTypeCode? : string;
    customerTypeName?:string;
    active?:string;
      
 }


//  export interface CustomerType{

//     code:number,
//     name:string,
//     totalCount:number
       
//   }
 
//   {
//      "responseData": [
//        {
//          "code": 0,
//          "name": "string",
//          "totalCount": 0
//        }
//      ],
//      "errCode": 0,
//      "message": "string"
//    }