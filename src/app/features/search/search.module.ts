import {NgModule} from '@angular/core';

import {SearchRoutingModule} from './search-routing.module';
import {SearchComponent} from './page/search/search.component';
import {SharedModule} from "../../shared/shared.module";


@NgModule({
  declarations: [
    SearchComponent
  ],
  imports: [
    SharedModule,
    SearchRoutingModule
  ]
})
export class SearchModule { }
