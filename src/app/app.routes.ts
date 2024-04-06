import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AddNewCompanyComponent } from './modules/company/add-new-company/add-new-company.component';
import { ErrorPageComponent } from './error-page/error-page.component';

export const routes: Routes = [
    { path: "", redirectTo: "home", pathMatch: 'full' },
    { path: "home", component: HomeComponent },
    {
        path: "company", loadChildren:
            () => import("./modules/company/company.module").then(m => m.CompanyModule)
    },
    {
        path: "employee", loadChildren:
            () => import("./modules/employee/employee.module").then(m => m.EmployeeModule)
    },
    { path: "company/new-company", component: AddNewCompanyComponent },
    { path: "**", component: ErrorPageComponent }
];
