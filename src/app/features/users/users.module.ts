import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import {SharedModule} from "../../shared/shared.module";
import { NewUserFormComponent } from './dialog/new-user-form/new-user-form.component';


@NgModule({
  declarations: [
    NewUserFormComponent
  ],
  imports: [
    SharedModule,
    UsersRoutingModule
  ]
})
export class UsersModule { }
