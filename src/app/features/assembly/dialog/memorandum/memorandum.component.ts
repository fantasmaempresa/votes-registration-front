import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {CreateAssemblyComponent} from "../create-assembly/create-assembly.component";
import {FormControl, FormGroup} from "@angular/forms";
import {AssemblyService} from "../../../../core/services/assembly.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-memorandum',
  templateUrl: './memorandum.component.html',
  styleUrls: ['./memorandum.component.scss']
})
export class MemorandumComponent implements OnInit {
  saveMemorandum = false;
  form!: FormGroup;

  constructor(public dialogRef: MatDialogRef<CreateAssemblyComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private assemblyService: AssemblyService) { }

  ngOnInit(): void {
    this.createFormGroup();
  }

  createFormGroup() {
    this.form = new FormGroup({
      'id': new FormControl(''),
      'memorandum': new FormControl()
    });
    this.form.patchValue(this.data.payload);
  }

  save() {
    console.log(this.form.value);
    this.assemblyService.update(this.form.value).subscribe({
      next: (resp) => {
        console.log(resp);
        this.dialogRef.close(true);
      },
      error: (err) => {
        Swal.fire('Servicio no disponible', 'Algo ha salido mal', 'error')
      }
    })
  }

}
