import {NgModule} from '@angular/core';

import {ResultsRoutingModule} from './results-routing.module';
import {ResultsComponent} from './page/results/results.component';
import {SharedModule} from "../../shared/shared.module";
import { VotersComponent } from './page/voters/voters.component';


@NgModule({
  declarations: [
    ResultsComponent,
    VotersComponent
  ],
  imports: [
    SharedModule,
    ResultsRoutingModule
  ]
})
export class ResultsModule { }
