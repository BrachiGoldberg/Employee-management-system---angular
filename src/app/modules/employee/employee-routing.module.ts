import { NgModule } from "@angular/core";
import { Route, RouterModule } from "@angular/router";
import { EmployeesListComponent } from "./employees-list/employees-list.component";
import { EmployeeDetailsComponent } from "./employee-details/employee-details.component";
import { AddUpdateEmployeeComponent } from "./add-update-employee/add-update-employee.component";
import { EmployeeTermsComponent } from "./employee-terms/employee-terms.component";
import { BankAccountComponent } from "./bank-account/bank-account.component";


const employeeRoutes : Route[] = [
    {path: "", redirectTo: "list-employees", pathMatch: 'full'},
    {path: "list-employees", component: EmployeesListComponent},
    {path: "emp-id/:id", component: EmployeeDetailsComponent},
    {path: "new-emp", component: AddUpdateEmployeeComponent},
    {path: "update-emp-id/:id", component: AddUpdateEmployeeComponent},
    {path: "add-manager", component: AddUpdateEmployeeComponent},
    {path: "update-emp-terms/:id", component: EmployeeTermsComponent},
    {path: "new-emp-terms", component: EmployeeTermsComponent},
    {path: "manager-emp-terms", component: EmployeeTermsComponent},
    {path: "update-account-b/:id", component: BankAccountComponent},
    {path: "new-account-b", component: BankAccountComponent},
    {path: "manager-account-b", component: BankAccountComponent},
    {path: "update-account-b", component: BankAccountComponent},
]

@NgModule({
    imports: [RouterModule.forChild(employeeRoutes)],
    exports: [RouterModule]
})
export class EmployeeRoutingModule{
    
}