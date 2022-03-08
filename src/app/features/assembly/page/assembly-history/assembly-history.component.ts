import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {AddBaseStaffComponent} from "../../../../shared/components/dialog/add-base-staff/add-base-staff.component";
import {CreateAssemblyComponent} from "../../dialog/create-assembly/create-assembly.component";

@Component({
  selector: 'app-assembly-history',
  templateUrl: './assembly-history.component.html',
  styleUrls: ['./assembly-history.component.scss']
})
export class AssemblyHistoryComponent implements OnInit {
  assemblies$!: Observable<any>

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  deleteAssembly(assembly: any) {

  }

  blockEdition(assembly: any) {

  }

  openDialog() {
    const dialogRef = this.dialog.open(CreateAssemblyComponent, {});
    dialogRef.afterClosed().subscribe(result => {
      console.log('Todo chido')
    })
  }

}
