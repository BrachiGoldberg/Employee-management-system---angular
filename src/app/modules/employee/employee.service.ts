import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee, EmployeePostModel } from './models/employee.model';
import { EmployeePosition, Position } from './models/position.model.';
import { EmployeeTerms } from './models/employee-terms.model';
import { BankAccount } from './models/bank-account.model';
import { map } from 'rxjs/operators';
import { AttendanceJournal, AttendanceJournalPostModel } from './models/attendance-journal.model';


const baseUrl = 'https://localhost:7081/api'


@Injectable({
  providedIn: 'root'
})
export class EmployeeService {


  constructor(private _http: HttpClient) { }


  getTokenBearer() {
    let token = sessionStorage.getItem("token")
    if (token) {
      return token
    }
    return null;
  }

  //good!
  getAllEmployeesByCompanyId(companyId: number): Observable<Employee[]> {
    let token = this.getTokenBearer()
    return this._http.get<Employee[]>(`${baseUrl}/Employee/${companyId}`, { headers: { "Authorization": `Bearer ${token}` } })
  }

  //good!
  getEmployee(empId: number): Observable<Employee> {
    let token = this.getTokenBearer()
    return this._http.get<Employee>(`${baseUrl}/Employee/emp-id/${empId}`, { headers: { "Authorization": `Bearer ${token}` } })
  }

  //good!
  removeEmployeeFromCompany(empId: number): Observable<Employee> {
    let token = this.getTokenBearer()
    return this._http.put<Employee>(`${baseUrl}/Employee/delete/emp-id/${empId}`, {}, { headers: { "Authorization": `Bearer ${token}` } })
  }

  //good!
  addNewEmployee(companyId: number, employee: Employee, termsId: number, bankId: number): Observable<Employee> {
    let token = this.getTokenBearer()
    let data1 = new Date(employee.birthDate!)
    let data2 = new Date(employee.startJob!)
    let positionsToSend: { positionId: number | undefined; startPosition: Date | undefined; }[] = []
    employee.positions.forEach(p => positionsToSend.push({ positionId: p.positionId, startPosition: p.startPositionDate }))

    return this._http.post<Employee>(`${baseUrl}/Employee/${companyId}?termsId=${termsId}&bankAccountId=${bankId}`,
      {
        "firstName": employee.firstName,
        "lastName": employee.lastName,
        "identity": employee.identity,
        "isMale": employee.isMale,
        "birthDate": data1,
        "address": employee.address,
        "email": employee.email,
        "credits": employee.credits,
        "startJob": data2,
        "positions": positionsToSend
      }, { headers: { "Authorization": `Bearer ${token}` } })
  }

  //good!
  updateEmployee(empId: number | undefined, employee: Employee): Observable<Employee> {
    let token = this.getTokenBearer()
    let myEmp = {
      "firstName": employee.firstName,
      "lastName": employee.lastName,
      "address": employee.address,
      "email": employee.email,
      "credits": employee.credits
    }
    return this._http.put<Employee>(`${baseUrl}/Employee/${empId}`, myEmp, { headers: { "Authorization": `Bearer ${token}` } })
  }

  //---------------- Positions --------------------
  getPositions(): Observable<Position[]> {
    let token = this.getTokenBearer()
    return this._http.get<Position[]>(`${baseUrl}/Position`, { headers: { "Authorization": `Bearer ${token}` } })
  }

  updatePositions(empId: number, positionsList: EmployeePosition[]): Observable<Employee> {
    let token = this.getTokenBearer()
    let positionsToSend: { positionId: number | undefined; startPosition: Date | undefined; }[] = []
    positionsList.forEach(p => positionsToSend.push({ positionId: p.positionId, startPosition: p.startPositionDate }))
    return this._http.put<Employee>(`${baseUrl}/Employee/${empId}/positions`, positionsToSend, { headers: { "Authorization": `Bearer ${token}` } })
  }

  addNewPosition(position: Position): Observable<Position> {
    let token = this.getTokenBearer()
    return this._http.post<Position>(`${baseUrl}/Position`, {
      "name": position.name,
    }, { headers: { "Authorization": `Bearer ${token}` } })
  }

  //---------------- Download Employee --------------------
  downloadCsv(compId: number): Observable<Blob> {
    let token = this.getTokenBearer()
    return this._http.get(`${baseUrl}/employee/${compId}/download`,
      { headers: { "Authorization": `Bearer ${token}` }, responseType: 'text' }).pipe(
        map((response: any) => {
          const blob = new Blob([response], { type: 'text/csv' });
          return blob;
        })
      )
  }

  //---------------- Employee Terms --------------------
  addEmployeeTerms(terms: EmployeeTerms): Observable<EmployeeTerms> {
    let token = this.getTokenBearer()
    return this._http.post<EmployeeTerms>(`${baseUrl}/EmployeeTerms`, {
      hourlyWage: terms.hourlyWage ? terms.hourlyWage : 0,
      overtimePay: terms.overtimePay ? terms.overtimePay : 0,
      monthlyHoursCount: terms.monthlyHoursCount ? terms.monthlyHoursCount : 0,
      travelExpenses: terms.travelExpenses ? terms.travelExpenses : 0,
      sickDays: terms.sickDays ? terms.sickDays : 0,
      educationFund: terms.educationFund ? terms.educationFund : 0
    }, { headers: { "Authorization": `Bearer ${token}` } })
  }

  getEmpTermsById(id: number): Observable<EmployeeTerms> {
    let token = this.getTokenBearer()
    return this._http.get<EmployeeTerms>(`${baseUrl}/EmployeeTerms/${id}`, { headers: { "Authorization": `Bearer ${token}` } })
  }

  updateEmpTerms(id: number, terms: EmployeeTerms): Observable<EmployeeTerms> {
    let token = this.getTokenBearer()
    return this._http.put<EmployeeTerms>(`${baseUrl}/EmployeeTerms/emp-id/${id}`, terms, { headers: { "Authorization": `Bearer ${token}` } })
  }

  //---------------- Bank Account --------------------
  addBankAccount(account: BankAccount): Observable<BankAccount> {
    let token = this.getTokenBearer()
    return this._http.post<BankAccount>(`${baseUrl}/BankAccount`, {
      bankNunber: account.bankNunber,
      branchNumber: account.branchNumber,
      bankAccountNumber: account.bankAccountNumber
    }, { headers: { "Authorization": `Bearer ${token}` } })
  }

  getBankById(id: number): Observable<BankAccount> {
    let token = this.getTokenBearer()
    return this._http.get<BankAccount>(`${baseUrl}/BankAccount/${id}`, { headers: { "Authorization": `Bearer ${token}` } })
  }

  updateAccount(id: number, account: BankAccount): Observable<BankAccount> {
    let token = this.getTokenBearer()
    return this._http.put<BankAccount>(`${baseUrl}/BankAccount/${id}`, account, { headers: { "Authorization": `Bearer ${token}` } })
  }


  //---------------- Attendance Journal --------------------
  addListAtendanceJournals(fileContent: AttendanceJournalPostModel[]): Observable<AttendanceJournal> {
    let token = this.getTokenBearer()
    return this._http.post<AttendanceJournal>(`${baseUrl}/AttendanceJournal`, 
      fileContent, { headers: { "Authorization": `Bearer ${token}` } })
  }

}
