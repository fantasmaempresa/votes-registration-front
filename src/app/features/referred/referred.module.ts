import {NgModule} from '@angular/core';

import {ReferredRoutingModule} from './referred-routing.module';
import {SharedModule} from "../../shared/shared.module";
import {ReferredComponent} from './page/referred/referred.component';


@NgModule({
  declarations: [
    ReferredComponent
  ],
  imports: [
    SharedModule,
    ReferredRoutingModule
  ]
})
export class ReferredModule {
}
