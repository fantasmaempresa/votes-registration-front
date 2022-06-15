import { Component, OnInit } from '@angular/core';
import {SocketService} from "../../../../core/services/socket.service";

@Component({
  selector: 'app-counting',
  templateUrl: './counting.component.html',
  styleUrls: ['./counting.component.scss']
})
export class CountingComponent implements OnInit {
  attendance = 0;
  absence = 0;

  constructor(private socketService: SocketService) { }

  ngOnInit(): void {
    this.socketService.subscribeToChannel('count', 'CountAssistedEvent', ({assisted, unassisted} : any) => {
      this.attendance = assisted;
      this.absence = unassisted

    })
  }

}
