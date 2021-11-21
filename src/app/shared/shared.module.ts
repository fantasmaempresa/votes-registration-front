import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {PageNotFoundComponent} from './components/page-not-found/page-not-found.component';
import {MaterialModule} from "./material/material.module";
import {NavbarComponent} from "../layout/navbar/navbar.component";
import {FooterComponent} from "../layout/footer/footer.component";
import {HttpClientModule} from "@angular/common/http";


@NgModule({
    declarations: [
        PageNotFoundComponent,
        NavbarComponent,
        FooterComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        MaterialModule,
        HttpClientModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        MaterialModule,
        HttpClientModule,
        NavbarComponent,
        FooterComponent
    ]
})
export class SharedModule {
}
