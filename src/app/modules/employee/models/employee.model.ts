import { EmployeePosition, Position } from "./position.model.";

export class Employee {

    id: number | undefined
    firstName: string | undefined
    lastName: string | undefined
    identity: string | undefined
    isMale: boolean | undefined
    birthDate: Date | undefined
    address: string | undefined
    email: string | undefined
    credits: number | undefined
    startJob: Date | undefined
    termsId: number | undefined
    positions: EmployeePosition[] = []
    bankAccountId: number | undefined

}

export class EmployeePostModel {

    firstName: string | undefined
    lastName: string | undefined
    identity: string | undefined
    isMale: boolean |undefined
    birthDate: Date | undefined
    address: string | undefined
    email: string | undefined
    credits: number | undefined
    startJob: Date | undefined
}