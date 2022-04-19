import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TemplatesRoutingModule } from './templates-routing.module';
import { TemplatePageComponent } from './page/template-page/template-page.component';
import {SharedModule} from "../../shared/shared.module";
import { TemplateListComponent } from './page/template-list/template-list.component';
import { TemplateFormComponent } from './dialog/template-form/template-form.component';
import { TemplateSelectionComponent } from './dialog/template-selection/template-selection.component';


@NgModule({
  declarations: [
    TemplatePageComponent,
    TemplateListComponent,
    TemplateFormComponent,
    TemplateSelectionComponent
  ],
  imports: [
    CommonModule,
    TemplatesRoutingModule,
    SharedModule
  ]
})
export class TemplatesModule { }
