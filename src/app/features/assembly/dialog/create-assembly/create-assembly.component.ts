import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AssemblyService} from "../../../../core/services/assembly.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-create-assembly',
  templateUrl: './create-assembly.component.html',
  styleUrls: ['./create-assembly.component.scss']
})
export class CreateAssemblyComponent implements OnInit {

  form!: FormGroup;

  constructor(public dialogRef: MatDialogRef<CreateAssemblyComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private assemblyService: AssemblyService
              ) { }

  ngOnInit(): void {
    this.createFormGroup();
  }

  createFormGroup() {
    this.form = new FormGroup({
      'name': new FormControl('', [Validators.required]),
      'description': new FormControl('', [Validators.required]),
    })
  }

  save() {
    this.form.markAllAsTouched();
    if(this.form.invalid) {
      return;
    }

    this.assemblyService.save(this.form.value).subscribe({
      next: (resp) => {
        Swal.fire('Exito', 'Se ha creado la asamblea', 'success');
        this.dialogRef.close(true)
      },
      error: () => {
        Swal.fire('Servicio no disponible', 'Algo ha salido mal', 'error')
      }
    })
  }
}
