import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-create-assembly',
  templateUrl: './create-assembly.component.html',
  styleUrls: ['./create-assembly.component.scss']
})
export class CreateAssemblyComponent implements OnInit {

  form!: FormGroup;

  constructor(public dialogRef: MatDialogRef<CreateAssemblyComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,) { }

  ngOnInit(): void {
  }

  createFormGroup() {
    this.form = new FormGroup({
      'name': new FormControl('', [Validators.required]),
      'description': new FormControl('', [Validators.required]),
    })
  }

  save() {

  }
}
