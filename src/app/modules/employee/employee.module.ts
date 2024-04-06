import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { EmployeeRoutingModule } from './employee-routing.module';
import { AddUpdateEmployeeComponent } from './add-update-employee/add-update-employee.component';
import { EmployeeDetailsComponent } from './employee-details/employee-details.component';
import { EmployeesListComponent } from './employees-list/employees-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
// import { AuthService } from '../company/auth.service';
import { EmployeeService } from './employee.service';
import { EmployeeTermsComponent } from './employee-terms/employee-terms.component';
import { BankAccountComponent } from './bank-account/bank-account.component';
import { RouterOutlet } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';




@NgModule({
  declarations: [
    AddUpdateEmployeeComponent,
    EmployeeDetailsComponent,
    EmployeesListComponent,
    EmployeeTermsComponent,
    BankAccountComponent,
  ],
  imports: [
    CommonModule,
    EmployeeRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    RouterOutlet,
    MatDialogModule
  ],
  providers: [
    EmployeeService,
    DatePipe
  ]
})
export class EmployeeModule { }
