export interface Customer{
    id? : number;
    customerCode?:string;
    customerName?:string;
    customerType?: string;
    contactNo?: string;
    gender?: number;
    territoryID?: string;
    emailId?: string;
    active?: number;
    billToAddress?:string;
    shipToAddress?:string;    
 }