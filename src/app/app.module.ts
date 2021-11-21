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
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {JwtInterceptor} from "./core/interceptors/jwt.interceptor";

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
        BrowserAnimationsModule,
        // WebBluetoothModule.forRoot({
        //     enableTracing: true // or false, this will enable logs in the browser's console
        // })
    ],
    exports: [],
    providers: [
        {provide: LocationStrategy, useClass: HashLocationStrategy},
        {
            provide: HTTP_INTERCEPTORS,
            useClass: JwtInterceptor,
            multi: true
        },
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
