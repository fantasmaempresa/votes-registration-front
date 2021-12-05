import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ReferredComponent} from "./page/referred/referred.component";

const routes: Routes = [
  {
    path: '',
    component: ReferredComponent,
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReferredRoutingModule {
}
