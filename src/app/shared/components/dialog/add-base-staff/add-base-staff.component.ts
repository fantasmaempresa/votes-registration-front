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
      'name': new FormControl('', [Validators.required]),
      'last_name': new FormControl('', [Validators.required]),
      'mother_last_name': new FormControl('', [Validators.required]),
      'gender': new FormControl('', [Validators.required]),
      'denomination_job': new FormControl(''),
      'denomination_job_description': new FormControl(''),
      'cve_job_level': new FormControl(''),
      'phone_number': new FormControl('', {
        validators: [Validators.maxLength(10)],
        updateOn: 'change'
      }),
      'expedient': new FormControl(''),
      'dependency': new FormControl('', [Validators.required]),
      'affiliation_area': new FormControl('', ),
      'exercise': new FormControl('N/A', [Validators.required]),
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
      const fullName = `${this.data.payload.name} ${this.data.payload.last_name} ${this.data.payload.mother_last_name}`;
      this.basePersonalService.updateBasePersonal(this.form.value).subscribe({
        next: () => {
          Swal.fire('Información Actualizada', `La información de ${fullName} ha sido actualizada correctamente`, 'success');
          // const searchString$ = merge(
          //   defer(() => of(this.searchControl.value)),
          //   this.searchControl.valueChanges
          // ).pipe(
          //   debounceTime(1000),
          //   distinctUntilChanged()
          // );
          // this.searchResults$ = searchString$.pipe(
          //   tap(() => this.isLoadingResults = true),
          //   switchMap((searchString: string) =>
          //     this.searchService.search(searchString)
          //   ),
          //   share(),
          //   tap(() => this.isLoadingResults = false),
          // );
        },
        error:  () => {
          Swal.fire('Algo salio mal...', `Servicio no disponible`, 'error');
        }
      });
    } else {
      this.basePersonalService.save(this.form.value).subscribe({
        next: async () => {
          await Swal.fire('Compañero registrado', 'Se ha registrado correctamente', 'success');
          this.printerService.printAddBaseStaffTicket(this.form.value);
          this.dialogRef.close(true);
        },
        error: async err => {
          await Swal.fire('Error al registrar', 'Ha ocurrido un error, intentelo más tarde', 'error');
        }
      })
    }
  }

}
