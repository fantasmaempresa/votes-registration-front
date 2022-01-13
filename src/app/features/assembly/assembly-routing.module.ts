import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AssemblyComponent} from "./page/assembly/assembly.component";
import {SignaturesComponent} from "./page/signatures/signatures.component";
import {ResumeComponent} from "./page/resume/resume.component";

const routes: Routes = [
  {
    path: '',
    component: AssemblyComponent,
    children: [
      {path: 'signatures', component: SignaturesComponent},
      {path: 'resume', component: ResumeComponent},
      {path: '', redirectTo: 'signatures', pathMatch: 'full'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssemblyRoutingModule { }
