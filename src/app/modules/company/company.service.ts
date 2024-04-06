import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Company } from './models/company.model';
import { CompanyTerms } from './models/company-terms.model';

const baseUrl = 'https://localhost:7081/api'

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private _http: HttpClient) { }

  private getTokenBearer() {
    let token = sessionStorage.getItem("token")
    if (token) {
      return token
    }
    return null;
  }

  //good!
  loginToCompany(password: string | undefined, userName: string | undefined): Observable<any> {
    return this._http.post<any>(`${baseUrl}/Auth/login`,
      { userName: userName, password: password })
  }

  addNewCompany(newCompany: Company, termsId: number): Observable<any> {
    let token = this.getTokenBearer()
    return this._http.post(`${baseUrl}/Auth/register?termsId=${termsId}`, {
      name: newCompany.name,
      description: newCompany.description,
      address: newCompany.address,
      email: newCompany.email,
      userName: newCompany.userName,
      password: newCompany.password,
      manager: newCompany.manager
    }, { headers: { "Authorization": `Bearer ${token}` } })
  }

  getCompanyById(compId: number): Observable<Company> {
    let token = this.getTokenBearer()
    return this._http.get<Company>(`${baseUrl}/Company/${compId}`, { headers: { "Authorization": `Bearer ${token}` } })
  }

  updateCompany(compId: number, company: Company): Observable<Company> {
    let token = this.getTokenBearer()
    return this._http.put<Company>(`${baseUrl}/Company/${compId}`, {
      name: company.name,
      description: company.description,
      address: company.address,
      email: company.email
    }, { headers: { "Authorization": `Bearer ${token}` } })
  }

  updateCompanyEntryDetails(compId: number, userName: string, password: string): Observable<Company> {
    let token = this.getTokenBearer()
    return this._http.put<Company>(`${baseUrl}/Company/${compId}/entry-details`, {
      userName: userName,
      password: password
    }, { headers: { "Authorization": `Bearer ${token}` } })
  }

  //-------------------- Company Terms ------------------------
  addCompanyTerms(terms: CompanyTerms): Observable<CompanyTerms> {
    let token = this.getTokenBearer()
    return this._http.post<CompanyTerms>(`${baseUrl}/CompanyTerms`, {
      meals: terms.meals? terms.meals: 0,
      nightShiftPrecent: terms.nightShiftPrecent? terms.nightShiftPrecent: 0,
      shabbatShiftPrecent: terms.shabbatShiftPrecent? terms.shabbatShiftPrecent: 0,
      gifts: terms.gifts? terms.gifts: 0,
      clothing: terms.clothing? terms.clothing: 0,
      recovery: terms.recovery? terms.recovery: 0,
      birthDays: terms.birthDays? terms.birthDays: 0,
      daySalariesCalculation: terms.daySalariesCalculation? terms.daySalariesCalculation: 10
    },
      { headers: { "Authorization": `Bearer ${token}` } })
  }

  getCompanyTermsById(compId: number): Observable<CompanyTerms> {
    let token = this.getTokenBearer()
    return this._http.get<CompanyTerms>(`${baseUrl}/CompanyTerms/${compId}`,
      { headers: { "Authorization": `Bearer ${token}` } })
  }

  updateCompanyTerms(compId: number, terms: CompanyTerms): Observable<CompanyTerms> {
    let token = this.getTokenBearer()
    return this._http.put<CompanyTerms>(`${baseUrl}/CompanyTerms/${compId}`, {
      meals: terms.meals,
      nightShiftPrecent: terms.nightShiftPrecent,
      shabbatShiftPrecent: terms.shabbatShiftPrecent,
      gifts: terms.gifts,
      clothing: terms.clothing,
      recovery: terms.recovery,
      birthDays: terms.birthDays,
      daySalariesCalculation: terms.daySalariesCalculation
    },
      { headers: { "Authorization": `Bearer ${token}` } })
  }
}
