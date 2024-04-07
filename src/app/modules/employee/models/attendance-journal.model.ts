import { Time } from "@angular/common"

export class AttendanceJournal {

    id: number | undefined
    date: Date | undefined
    beginningTime: Time | undefined
    endTime: Time | undefined

}

export class AttendanceJournalPostModel {

    employeeId : number | undefined
    date: Date | undefined
    beginHour: number | undefined
    beginMinutes: number | undefined
    endHour: number | undefined
    endMinutes: number | undefined

}