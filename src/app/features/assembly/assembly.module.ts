import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssemblyRoutingModule } from './assembly-routing.module';
import { AssemblyComponent } from './page/assembly/assembly.component';
import {SharedModule} from "../../shared/shared.module";
import { SignaturesComponent } from './page/signatures/signatures.component';
import { ResumeComponent } from './page/resume/resume.component';
import { CreateAssemblyComponent } from './dialog/create-assembly/create-assembly.component';
import {AssemblyHistoryComponent} from "./page/assembly-history/assembly-history.component";


@NgModule({
  declarations: [
    AssemblyComponent,
    AssemblyHistoryComponent,
    SignaturesComponent,
    ResumeComponent,
    CreateAssemblyComponent
  ],
  imports: [
    SharedModule,
    AssemblyRoutingModule
  ]
})
export class AssemblyModule { }
