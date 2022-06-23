import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {BasePersonalService} from "../../../../core/services/base-personal.service";
import Swal from "sweetalert2";
import {PrinterService} from "../../../../core/services/printer.service";

@Component({
  selector: 'app-add-base-staff',
  templateUrl: './add-base-staff.component.html',
  styleUrls: ['./add-base-staff.component.scss']
})
export class AddBaseStaffComponent implements OnInit {
  form!: FormGroup;

  get phoneNumber() {
    return this.form.get('phone_number');
  }

  constructor(public dialogRef: MatDialogRef<AddBaseStaffComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private basePersonalService: BasePersonalService,
              private printerService: PrinterService) { }

  ngOnInit(): void {
    this.createFormGroup();
  }

  createFormGroup() {
    this.form = new FormGroup({
      'name': new FormControl('', ),
      'last_name': new FormControl('', ),
      'mother_last_name': new FormControl('', ),
      'gender': new FormControl('', ),
      'denomination_job': new FormControl(''),
      'denomination_job_description': new FormControl(''),
      'cve_job_level': new FormControl(''),
      'phone_number': new FormControl('', {
        validators: [Validators.maxLength(10)],
        updateOn: 'change'
      }),
      'expedient': new FormControl(''),
      'dependency': new FormControl('', ),
      'affiliation_area': new FormControl(''),
      'missing_documents': new FormControl(''),
      'exercise': new FormControl('N/A', ),
    })

    if(this.data.edit) {
      this.form.addControl('id', new FormControl())
      this.form.patchValue(this.data.payload);
    }
  }

  save() {
    // if (!this.printerService.printCharacteristic) {
      // this.printerService.messageConnectPrinter();
      // return;
    // }
    this.form.markAllAsTouched();
    if(this.form.invalid) {
      return;
    }
    if(this.data.edit) {
      let fullName = `${this.data.payload.name}`;
      this.data.payload.last_name ? fullName = `${fullName} ${this.data.payload.last_name}` : null;
      console.log(fullName);
      this.data.payload.mother_last_name ? fullName = `${fullName} ${this.data.payload.mother_last_name}` : null;
      console.log(fullName);
      this.basePersonalService.updateBasePersonal(this.form.value).subscribe({
        next: () => {
          Swal.fire('Información Actualizada', `La información de ${fullName} ha sido actualizada correctamente`, 'success');
          this.dialogRef.close(true);
        },
        error:  ({error}) => {
          Swal.fire('Algo salio mal...', error.error, 'error');
        }
      });
    } else {
      this.basePersonalService.save(this.form.value).subscribe({
        next: async () => {
          await Swal.fire('Compañero registrado', 'Se ha registrado correctamente', 'success');
          this.printerService.printAddBaseStaffTicket(this.form.value);
          this.dialogRef.close(true);
        },
        error: async ({error}) => {
          await Swal.fire('Error al registrar', error.error, 'error');
        }
      })
    }
  }
}
