import {Component, OnInit} from '@angular/core';
import {map, Observable} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {CreateAssemblyComponent} from "../../dialog/create-assembly/create-assembly.component";
import {AssemblyService} from "../../../../core/services/assembly.service";

@Component({
  selector: 'app-assembly-history',
  templateUrl: './assembly-history.component.html',
  styleUrls: ['./assembly-history.component.scss']
})
export class AssemblyHistoryComponent implements OnInit {
  assemblies$!: Observable<any>

  constructor(public dialog: MatDialog, private assemblyService: AssemblyService) { }

  ngOnInit(): void {
    this.assemblies$ = this.assemblyService.fetchAll().pipe(map((resp: any) => resp.data));
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
