import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ContentLayoutComponent} from "./layout/content-layout/content-layout.component";
import {AuthLayoutComponent} from "./layout/auth-layout/auth-layout.component";
import {PageNotFoundComponent} from "./shared/components/page-not-found/page-not-found.component";

const routes: Routes = [
    {
        path: 'auth',
        component: AuthLayoutComponent,
        loadChildren: () => import('./features/auth/auth.module').then((m) => m.AuthModule)
    },
    {
        path: '',
        component: ContentLayoutComponent,
        children: [
            {
                path: '',
                redirectTo: 'search',
                pathMatch: 'full'
            },
            {
                path: 'search',
                loadChildren: () => import('./features/search/search.module').then((m) => m.SearchModule)
            },
            {
                path: 'results',
                loadChildren: () => import('./features/results/results.module').then((m) => m.ResultsModule)
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
