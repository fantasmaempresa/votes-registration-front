import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit {

  selectedAssembly: any = null;

  constructor() { }

  ngOnInit(): void {
  }

  selectAssembly() {
    console.log('Asamble seleccionada')
  }

}
