import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {AttendanceService} from "../../../../core/services/attendance.service";

@Component({
  selector: 'app-list-attendance',
  templateUrl: './list-attendance.component.html',
  styleUrls: ['./list-attendance.component.scss']
})
export class ListAttendanceComponent implements OnInit {
  users$!: Observable<any>;

  constructor(private attendanceService: AttendanceService) {
    // this.users$ = attendanceService.filterByAttendance();
  }

  ngOnInit(): void {
  }

}
