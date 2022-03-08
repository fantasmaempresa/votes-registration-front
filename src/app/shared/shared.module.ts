import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {PageNotFoundComponent} from './components/page-not-found/page-not-found.component';
import {MaterialModule} from "./material/material.module";
import {NavbarComponent} from "../layout/navbar/navbar.component";
import {FooterComponent} from "../layout/footer/footer.component";
import {HttpClientModule} from "@angular/common/http";
import {AddBaseStaffComponent} from './components/dialog/add-base-staff/add-base-staff.component';
import {DigitOnlyModule} from "@uiowa/digit-only";


@NgModule({
    declarations: [
        PageNotFoundComponent,
        NavbarComponent,
        FooterComponent,
        AddBaseStaffComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        MaterialModule,
        HttpClientModule,
        DigitOnlyModule,
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        MaterialModule,
        HttpClientModule,
        NavbarComponent,
        FooterComponent,
        DigitOnlyModule
    ]
})
export class SharedModule {
}
