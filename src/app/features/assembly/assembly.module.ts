import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssemblyRoutingModule } from './assembly-routing.module';
import { AssemblyComponent } from './page/assembly/assembly.component';
import {SharedModule} from "../../shared/shared.module";
import { SignaturesComponent } from './page/signatures/signatures.component';
import { ResumeComponent } from './page/resume/resume.component';


@NgModule({
  declarations: [
    AssemblyComponent,
    SignaturesComponent,
    ResumeComponent
  ],
  imports: [
    SharedModule,
    AssemblyRoutingModule
  ]
})
export class AssemblyModule { }
