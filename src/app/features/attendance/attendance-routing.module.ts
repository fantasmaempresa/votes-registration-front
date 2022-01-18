import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AttendanceComponent} from "./Pages/attendance/attendance.component";
import {ListAttendanceComponent} from "./Pages/list-attendance/list-attendance.component";

const routes: Routes = [
  {
    path: '',
    component: AttendanceComponent,
  },
  {
    path: 'list',
    component: ListAttendanceComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendanceRoutingModule {
}
