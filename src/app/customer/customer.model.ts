
 export interface BusinessResponseData {
    responseData: CardInfo[];
    errCode: number;
    message: string;
  }
  
  export interface CardInfo {
    totalCount: number;
    cardCode: string;
    cardName: string;
    cardType: string;
    groupCode: number;
    cellular: string;
    emailAddress: string;
    valid: string;
    territory: number;
    series: number;
    taxId0: string;
    shiptoBPAddresses: AddressInfo[];
    billtoBPAddresses: AddressInfo[];
  }
  
  export interface AddressInfo {
    addressName: string;
    street: string;
    block: string;
    zipCode: string;
    city: string;
    country: string;
    state: string;
    addressType: string;
    bpCode: string;
    rowNum: number;
  }
  