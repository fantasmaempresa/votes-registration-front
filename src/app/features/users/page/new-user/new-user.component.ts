import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {NewUserFormComponent} from "../../dialog/new-user-form/new-user-form.component";

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit {

  constructor(public dialog: MatDialog,) {
  }

  ngOnInit(): void {
  }

  openDialog() {
    const dialogRef = this.dialog.open(NewUserFormComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        console.log('Todo chido')
      }
    });

  }

}
