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
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {UsersComponent} from './features/users/page/users/users.component';
import {NewUserComponent} from './features/users/page/new-user/new-user.component';
import {SearchModule} from "./features/search/search.module";
import {WINDOW_PROVIDERS} from "./core/providers/window.provider";
import {DocsComponent} from './public/docs/docs.component';
import {PdfViewerModule} from "ng2-pdf-viewer";
import { AnnouncementComponent } from './public/docs/dialog/announcement/announcement.component';

@NgModule({
    declarations: [
        AppComponent,
        AuthLayoutComponent,
        ContentLayoutComponent,
        ResultsLayoutComponent,
        UsersComponent,
        NewUserComponent,
        DocsComponent,
        AnnouncementComponent
    ],
    imports: [
        BrowserModule,
        CoreModule,
        SharedModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: environment.production,
            // Register the ServiceWorker as soon as the app is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:30000'
        }),
        SearchModule,
      PdfViewerModule,
        // WebBluetoothModule.forRoot({
        //     enableTracing: true // or false, this will enable logs in the browser's console
        // })
    ],
    exports: [],
    providers: [
      WINDOW_PROVIDERS,
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
