import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.scss']
})
export class AnnouncementComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<AnnouncementComponent>) {
    dialogRef.disableClose = true
  }

  ngOnInit(): void {
  }

  closeDialog() {
    this.dialogRef.disableClose = false;
    this.dialogRef.close();
  }

}
