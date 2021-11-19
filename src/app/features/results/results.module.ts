import {NgModule} from '@angular/core';

import {ResultsRoutingModule} from './results-routing.module';
import {ResultsComponent} from './page/results/results.component';
import {SharedModule} from "../../shared/shared.module";


@NgModule({
  declarations: [
    ResultsComponent
  ],
  imports: [
    SharedModule,
    ResultsRoutingModule
  ]
})
export class ResultsModule { }
