import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AuthLayoutComponent} from './layout/auth-layout/auth-layout.component';
import {ContentLayoutComponent} from './layout/content-layout/content-layout.component';
import {CoreModule} from "./core/core.module";
import {SharedModule} from "./shared/shared.module";
import {ResultsLayoutComponent} from './layout/results-layout/results-layout.component';
import {HashLocationStrategy, LocationStrategy} from "@angular/common";

@NgModule({
    declarations: [
        AppComponent,
        AuthLayoutComponent,
        ContentLayoutComponent,
        ResultsLayoutComponent
    ],
    imports: [
        BrowserModule,
        CoreModule,
        SharedModule,
        AppRoutingModule,
        BrowserAnimationsModule
    ],
    exports: [],
    providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],
    bootstrap: [AppComponent]
})
export class AppModule {
}
