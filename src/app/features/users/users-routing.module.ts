import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UsersComponent} from "./page/users/users.component";
import {ResultsLayoutComponent} from "../../layout/results-layout/results-layout.component";
import {NewUserComponent} from "./page/new-user/new-user.component";

const routes: Routes = [
  {
    path: '',
    component: ResultsLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        component: UsersComponent
      },
      {
        path: 'new',
        component: NewUserComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
