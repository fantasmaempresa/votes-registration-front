import {Component, OnInit} from '@angular/core';
import {map, Observable} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {CreateAssemblyComponent} from "../../dialog/create-assembly/create-assembly.component";
import {AssemblyService} from "../../../../core/services/assembly.service";
import Swal from "sweetalert2";
import {MemorandumComponent} from "../../dialog/memorandum/memorandum.component";

@Component({
  selector: 'app-assembly-history',
  templateUrl: './assembly-history.component.html',
  styleUrls: ['./assembly-history.component.scss']
})
export class AssemblyHistoryComponent implements OnInit {
  assemblies$!: Observable<any>

  constructor(public dialog: MatDialog, private assemblyService: AssemblyService) { }

  ngOnInit(): void {
    this.getAssemblies();
  }

  editAssembly(assembly: any) {
    const dialogRef = this.dialog.open(CreateAssemblyComponent, {
      data: {
        edit: true,
        payload: assembly
      }});
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.getAssemblies();
      }
    })
  }

  deleteAssembly(assembly: any) {
    Swal.fire({
      title: `¿Esta seguro de borrar la asamblea ${assembly.name}?`,
      text: "Una vez borrados los datos no hay marcha atras",
      showDenyButton: true,
      // showCancelButton: true,
      icon: 'warning',
      denyButtonText: `Cancelar`,
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#00d203',
      reverseButtons: false
    }).then((result) => {
      if(result.isConfirmed) {
        this.assemblyService.delete(assembly.id).subscribe({
          next: async () => {
            await Swal.fire('Asamblea borrada', 'Se ha borrado correctamente', 'success');
            this.getAssemblies();
          },
          error: async () => {
            await Swal.fire('Error al eliminar', 'Ha ocurrido un error, intentelo más tarde', 'error');
          }
        })
      }
    });
  }

  blockEdition(assembly: any) {
    if(assembly.lock === 0) {
      const dialogRef = this.dialog.open(MemorandumComponent, {data: {
          payload: assembly
        }});
      dialogRef.afterClosed().subscribe(result => {
        this.assemblyService.lockAssembly(assembly).subscribe({
          next: () => this.getAssemblies(),
          error: () => console.log('error')
        })
      });
      return;
    }

    if(assembly.lock === 1) {
      this.assemblyService.unlockAssembly(assembly).subscribe({
        next: () => this.getAssemblies(),
        error: () => console.log('error')
      })
      return;
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(CreateAssemblyComponent, {data: {
      edit: false
      }});
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.getAssemblies();
      }
    })
  }

  getAssemblies() {
    this.assemblies$ = this.assemblyService.fetchAll().pipe(map((resp: any) => resp.data));
  }

}
