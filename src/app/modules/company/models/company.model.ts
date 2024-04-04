import { Employee } from "../../employee/models/employee.model";

export class Company{

    id: number | undefined
    name: string | undefined
    description: string | undefined
    address: string | undefined
    email: string | undefined
    userName: string | undefined
    password: string | undefined
    manager: Manager | undefined
    termsId: number | undefined
    
}

export class Manager{
    companyId: number | undefined
    identity: string | undefined
}