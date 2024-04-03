import { NgModule } from "@angular/core";
import { Route, RouterModule } from "@angular/router";
import { AddNewCompanyComponent } from "./add-new-company/add-new-company.component";
import { LoginToCompanyComponent } from "./login-to-company/login-to-company.component";
import { CompanyTermsComponent } from "./company-terms/company-terms.component";
import { CompanyDetailsComponent } from "./company-details/company-details.component";
import { UpdateCompanyDetailsComponent } from "./update-company-details/update-company-details.component";
import { UpdateCompanyEntryDetailsComponent } from "./update-company-entry-details/update-company-entry-details.component";

const companyRoutes: Route[] = [
    { path: "", redirectTo: "login-company", pathMatch: 'full' },
    { path: "login-company", component: LoginToCompanyComponent },
    { path: "new-company", component: AddNewCompanyComponent },
    { path: "update-company/:id", component: UpdateCompanyDetailsComponent },
    { path: "new-terms", component: CompanyTermsComponent },
    { path: "comp-id/:compId/update-terms/:id", component: CompanyTermsComponent },
    { path: "details/:id", component: CompanyDetailsComponent },
    {path: "comp-id/:id/update-entry-details", component: UpdateCompanyEntryDetailsComponent}
]


@NgModule({
    imports: [RouterModule.forChild(companyRoutes)],
    exports: [RouterModule]
})
export class CompanyRoutingModule {

}