import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddNewCompanyComponent } from './add-new-company/add-new-company.component';
import { LoginToCompanyComponent } from './login-to-company/login-to-company.component';
import { CompanyRoutingModule } from './company-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompanyService } from './company.service';
import { RouterOutlet } from '@angular/router';
import { EmployeeModule } from '../employee/employee.module';
import { CompanyTermsComponent } from './company-terms/company-terms.component';
// import { HTTP_INTERCEPTORS } from '@angular/common/http';
// import { AuthService } from './auth.service';
import { CompanyDetailsComponent } from './company-details/company-details.component';
import { UpdateCompanyDetailsComponent } from './update-company-details/update-company-details.component';
import { UpdateCompanyEntryDetailsComponent } from './update-company-entry-details/update-company-entry-details.component';



@NgModule({
  declarations: [
    AddNewCompanyComponent,
    LoginToCompanyComponent, 
    CompanyTermsComponent,
    CompanyDetailsComponent,
    UpdateCompanyDetailsComponent,
    UpdateCompanyEntryDetailsComponent
  ],
  imports: [
    CommonModule,
    CompanyRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RouterOutlet,
    EmployeeModule
  ],
  providers: [CompanyService,
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: AuthService,
    //   multi: true,
    // },
  ]
})
export class CompanyModule { }
