import {Component, Inject, OnInit} from '@angular/core';
import {TemplatesService} from "../../../../data/services/templates.service";
import {map, Observable} from "rxjs";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormControl, Validators} from "@angular/forms";
import {BasePersonalService} from "../../../../core/services/base-personal.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-template-selection',
  templateUrl: './template-selection.component.html',
  styleUrls: ['./template-selection.component.scss']
})
export class TemplateSelectionComponent implements OnInit {
  selectedTemplate = new FormControl(null, [Validators.required])

  templates$!: Observable<any[]>;

  constructor(private templateService: TemplatesService,
              private basePersonalService: BasePersonalService,
              public dialogRef: MatDialogRef<TemplateSelectionComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,) {
  }

  ngOnInit(): void {
    console.log(this.data)
    this.templates$ = this.templateService.fetchAll().pipe(
      map((data: any) => data.data)
    );
  }

  submit() {
    console.log(this.selectedTemplate.value);
    this.basePersonalService.registerInTemplate(this.data.payload.id, this.selectedTemplate.value)
      .subscribe({
        next: () => {
          Swal.fire('Registrado', 'Se imprimira el comprobante', 'success');
          this.dialogRef.close(true)
        }
      })
  }

}
