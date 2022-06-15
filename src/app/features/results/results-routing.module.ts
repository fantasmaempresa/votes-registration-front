import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ResultsComponent} from "./page/results/results.component";
import {VotersComponent} from "./page/voters/voters.component";
import {ResultsLayoutComponent} from "../../layout/results-layout/results-layout.component";
import {AppGuard} from "../../core/guards/app.guard";

const routes: Routes = [
  {
    path: '',
    component: ResultsLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'show',
        pathMatch: 'full'
      },
      {
        path: 'show',
        component: ResultsComponent
      },
      {
        path: 'voters',
        component: VotersComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResultsRoutingModule { }
