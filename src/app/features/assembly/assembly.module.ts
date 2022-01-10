import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssemblyRoutingModule } from './assembly-routing.module';
import { AssemblyComponent } from './page/assembly/assembly.component';
import {SharedModule} from "../../shared/shared.module";


@NgModule({
  declarations: [
    AssemblyComponent
  ],
  imports: [
    SharedModule,
    AssemblyRoutingModule
  ]
})
export class AssemblyModule { }
