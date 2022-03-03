import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {BasePersonalService} from "../../../../core/services/base-personal.service";

@Component({
  selector: 'app-add-base-staff',
  templateUrl: './add-base-staff.component.html',
  styleUrls: ['./add-base-staff.component.scss']
})
export class AddBaseStaffComponent implements OnInit {
  form!: FormGroup;

  constructor(public dialogRef: MatDialogRef<AddBaseStaffComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private basePersonalService: BasePersonalService) { }

  ngOnInit(): void {
    this.createFormGroup();
  }

  createFormGroup() {
    this.form = new FormGroup({
      'name': new FormControl('', [Validators.required]),
      'last_name': new FormControl('', [Validators.required]),
      'mother_last_name': new FormControl('', [Validators.required]),
      'gender': new FormControl('N/A'),
      'denomination_jod': new FormControl('N/A'),
      'denomination_jod_description': new FormControl('N/A'),
      'cve_job_level': new FormControl('N/A'),
      'phone_number': new FormControl('', [Validators.required]),
      'expedient': new FormControl('N/A', [Validators.required]),
      'id_register': new FormControl('', [Validators.required]),
      'dependency': new FormControl('', [Validators.required]),
      'affiliation_area': new FormControl('', [Validators.required]),
    })
  }

  save() {
    this.basePersonalService.save(this.form.value).subscribe({
      next: (resp) => {
        console.log(resp)
      }
    })

  }

}
