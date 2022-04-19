import {Component, OnInit} from '@angular/core';
import {map, Observable} from "rxjs";
import {TemplatesService} from "../../../../data/services/templates.service";
import {MatDialog} from "@angular/material/dialog";
import {TemplateFormComponent} from "../../dialog/template-form/template-form.component";
import {CreateAssemblyComponent} from "../../../assembly/dialog/create-assembly/create-assembly.component";
import Swal from "sweetalert2";

@Component({
  selector: 'app-template-list',
  templateUrl: './template-list.component.html',
  styleUrls: ['./template-list.component.scss']
})
export class TemplateListComponent implements OnInit {

  templates$!: Observable<any>;

  constructor(private templateService: TemplatesService,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getTemplates()
  }

  openDialog() {
    const dialogRef = this.dialog.open(TemplateFormComponent, {
      width: '100vw',
      data: {
        edit: false
      }});
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.getTemplates();
      }
    })
  }

  editTemplate(template: any) {
    const dialogRef = this.dialog.open(TemplateFormComponent, {
      width: '100vw',
      data: {
        edit: true,
        payload: template
      }});
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.getTemplates();
      }
    })
  }

  getTemplates() {
    this.templates$ = this.templateService.fetchAll()
      .pipe(
        map((data: any) => data.data)
      )
  }

  deleteTemplate(template: any) {
    Swal.fire({
      title: `¿Esta seguro de borrar la plantilla ${template.name}?`,
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
        this.templateService.delete(template.id).subscribe({
          next: async () => {
            await Swal.fire('Plantilla borrada', 'Se ha borrado correctamente', 'success');
            this.getTemplates();
          },
          error: async () => {
            await Swal.fire('Error al eliminar', 'Ha ocurrido un error, intentelo más tarde', 'error');
          }
        })
      }
    });
  }

}
