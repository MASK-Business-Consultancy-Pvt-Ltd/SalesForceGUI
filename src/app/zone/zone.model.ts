
export interface Territory {
    territoryId: number,
    description: string,
    inactive: string,
    parent: number,
    totalCount: number
}

export interface TerritoryResponse {
    responseData: Territory[],
    errCode: number,
    message: string
}

export interface AddTerritory {
    description: string,
    parent: number,
    inactive: string
}


