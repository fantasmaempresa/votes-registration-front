import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TemplatePageComponent} from "./page/template-page/template-page.component";
import {TemplateListComponent} from "./page/template-list/template-list.component";

const routes: Routes = [
  {
    path: '',
    component: TemplatePageComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        component: TemplateListComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TemplatesRoutingModule { }
