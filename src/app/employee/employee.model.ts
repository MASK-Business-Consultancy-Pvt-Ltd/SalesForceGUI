export interface Employee {
    empId: number,
    employeeCode: string,
    firstName: string,
    lastName: string,
    position: number,
    manager: number,
    mobilePhone: string,
    workStreet: string,
    workBlock: string,
    workZipCode: string,
    workCity: string,
    workCountryCode: string,
    workStateCode: string,
    active: string,
    u_Pwd: string,
    territories: Territories[],
    totalCount: number
}


export interface EmployeeResponse {
    responseData: Employee[],
    errCode: number,
    message: string
}

export interface Territories {
    code: string,
    name: string,
    u_TerrId: string,
    u_Active: string
}


export interface addEmployee {
    wrapperStandardRequest: {
        empId:number,
        employeeCode: string,
        firstName: string,
        lastName: string,
        position: number,
        manager: number,
        mobilePhone: string,
        workStreet: string,
        workBlock: string,
        workZipCode: string,
        workCity: string,
        workCountryCode: string,
        workStateCode: string,
        active: string,
        u_Pwd: string
    },
    territories: Territories[]
}

export interface GeoResource {
    code: string,
    name: string

}

export interface GeoResourceResponse {
    responseData: GeoResource[],
    errCode: number,
    message: string
}