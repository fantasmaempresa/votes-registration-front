import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ContentLayoutComponent} from "./layout/content-layout/content-layout.component";
import {AuthLayoutComponent} from "./layout/auth-layout/auth-layout.component";
import {PageNotFoundComponent} from "./shared/components/page-not-found/page-not-found.component";
import {AuthGuard} from "./core/guards/auth.guard";
import {AppGuard} from "./core/guards/app.guard";
import {CountingComponent} from "./features/assembly/page/counting/counting.component";
import {DocsComponent} from "./public/docs/docs.component";

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
    data: {
      roles: [1,2,3]
    },
    children: [
      {
        path: '',
        redirectTo: 'search',
        pathMatch: 'full'
      },
      {
        path: 'search',
        canLoad: [AppGuard],
        data: {
          roles: [1,2,3]
        },
        loadChildren: () => import('./features/search/search.module').then((m) => m.SearchModule)
      },
      {
        path: 'results',
        canLoad: [AppGuard],
        data: {
          roles: [1,2]
        },
        loadChildren: () => import('./features/results/results.module').then((m) => m.ResultsModule)
      },
      {
        path: 'assembly',
        canLoad: [AppGuard],
        data: {
          roles: [1,2]
        },
        loadChildren: () => import('./features/assembly/assembly.module').then((m) => m.AssemblyModule)
      },
      {
        path: 'templates',
        canLoad: [AppGuard],
        data: {
          roles: [1,2]
        },
        loadChildren: () => import('./features/templates/templates.module').then((m) => m.TemplatesModule)
      },
      {
        path: 'users',
        canLoad: [AppGuard],
        data: {
          roles: [1,2]
        },
        loadChildren: () => import('./features/users/users.module').then((m) => m.UsersModule)
      },
      {
        path: 'referred',
        canLoad: [AppGuard],
        data: {
          roles: [1,2]
        },
        loadChildren: () => import('./features/referred/referred.module').then((m) => m.ReferredModule)
      },
      {
        path: 'attendance',
        canLoad: [AppGuard],
        data: {
          roles: [1,2]
        },
        loadChildren: () => import('./features/attendance/attendance.module').then((m) => m.AttendanceModule)
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
  },
  {
    path: 'counting',
    component: CountingComponent,
  },
  {
    path: 'docs',
    component: DocsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
