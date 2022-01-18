import {NgModule} from '@angular/core';

import {AttendanceRoutingModule} from './attendance-routing.module';
import {AttendanceComponent} from './Pages/attendance/attendance.component';
import {SharedModule} from "../../shared/shared.module";
import {SearchModule} from "../search/search.module";
import { ListAttendanceComponent } from './Pages/list-attendance/list-attendance.component';


@NgModule({
  declarations: [
    AttendanceComponent,
    ListAttendanceComponent
  ],
  imports: [
    SharedModule,
    AttendanceRoutingModule,
    SearchModule
  ]
})
export class AttendanceModule {
}
