import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ContentLayoutComponent} from "./layout/content-layout/content-layout.component";
import {AuthLayoutComponent} from "./layout/auth-layout/auth-layout.component";
import {PageNotFoundComponent} from "./shared/components/page-not-found/page-not-found.component";
import {AuthGuard} from "./core/guards/auth.guard";
import {AppGuard} from "./core/guards/app.guard";

const routes: Routes = [
    {
        path: '',
        redirectTo: 'auth',
        pathMatch: 'full'
    },
    {
        path: 'auth',
        component: AuthLayoutComponent,
        canActivate: [AuthGuard],
        loadChildren: () => import('./features/auth/auth.module').then((m) => m.AuthModule)
    },
    {
        path: 'app',
        component: ContentLayoutComponent,
        canActivate: [AppGuard],
        children: [
            {
                path: '',
                redirectTo: 'search',
                pathMatch: 'full'
            },
            {
                path: 'search',
                canActivate: [AppGuard],
                canLoad: [AppGuard],
                loadChildren: () => import('./features/search/search.module').then((m) => m.SearchModule)
            },
            {
                path: 'results',
                canActivate: [AppGuard],
                canLoad: [AppGuard],
                loadChildren: () => import('./features/results/results.module').then((m) => m.ResultsModule)
            },
            {
                path: 'users',
                canActivate: [AppGuard],
                canLoad: [AppGuard],
                loadChildren: () => import('./features/users/users.module').then((m) => m.UsersModule)
            },
            {
                path: '**',
                redirectTo: '404',
                pathMatch: 'full',
            },
            {
                path: '404',
                component: PageNotFoundComponent,
                data: {breadcrumb: {skip: true, alias: 'pageNotFound'}},
            },
        ],
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
