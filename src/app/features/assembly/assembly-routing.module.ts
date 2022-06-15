import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AssemblyComponent} from "./page/assembly/assembly.component";
import {SignaturesComponent} from "./page/signatures/signatures.component";
import {ResumeComponent} from "./page/resume/resume.component";
import {AssemblyHistoryComponent} from "./page/assembly-history/assembly-history.component";
import {AbsencesComponent} from "./page/absences/absences.component";
import {CountingComponent} from "./page/counting/counting.component";

const routes: Routes = [
  {
    path: '',
    component: AssemblyComponent,
    children: [
      {path: 'history', component: AssemblyHistoryComponent},
      {path: 'signatures', component: SignaturesComponent},
      {path: 'absences', component: AbsencesComponent},
      {path: 'counting', component: CountingComponent},
      {path: 'resume', component: ResumeComponent},
      {path: '', redirectTo: 'history', pathMatch: 'full'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssemblyRoutingModule { }
