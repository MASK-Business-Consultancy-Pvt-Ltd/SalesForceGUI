
export interface Product {
  itemCode?: string,
  itemName: string,
  itemsGroupCode: number,
  valid: string,
  totalCount?: number

}

export interface ProductResponse {
  responseData: Product[],
  errCode: number,
  message: string
}