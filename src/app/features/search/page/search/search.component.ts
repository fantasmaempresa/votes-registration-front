import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import Swal from 'sweetalert2'
import {FormControl} from "@angular/forms";
import {debounceTime, defer, distinctUntilChanged, map, merge, Observable, of, share, switchMap, tap} from "rxjs";
import {SearchService} from "../../../../core/services/search.service";
import {BasePersonalService} from "../../../../core/services/base-personal.service";
import {ReferredService} from "../../../../data/services/referred.service";
import {AuthService} from "../../../../core/services/auth.service";
import {UserModel} from "../../../../data/models/user.model";
import {AttendanceService} from "../../../../core/services/attendance.service";
import {PrinterService} from "../../../../core/services/printer.service";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, AfterViewInit {
  @Input() assembly: any;
  @ViewChild("searchInput") searchInput!: ElementRef;
  // define your services and characteristics
  searchControl!: FormControl;
  searchResults$!: Observable<any>;
  public areMinimumCharactersTyped$!: Observable<boolean>;
  public areNoResultsFound$!: Observable<boolean>;
  isLoadingResults = false;
  user!: UserModel;

  @Input()
  actions = '';

  constructor(
    private authService: AuthService,
    private searchService: SearchService,
    private referredService: ReferredService,
    private basePersonalService: BasePersonalService,
    private attendanceService: AttendanceService,
    private printerService: PrinterService,
    private cdRef: ChangeDetectorRef,
    public dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.authService.getDataUserLogged().subscribe(res => console.log(res));
    this.user = this.authService.getUser();
    this.searchControl = new FormControl('');
    this.areMinimumCharactersTyped$ = this.searchControl.valueChanges.pipe(
      map(searchString => searchString.length >= 3)
    );
    const searchString$ = merge(
      defer(() => of(this.searchControl.value)),
      this.searchControl.valueChanges
    ).pipe(
      debounceTime(1000),
      distinctUntilChanged()
    );
    this.searchResults$ = searchString$.pipe(
      tap(() => this.isLoadingResults = true),
      switchMap((searchString: string) =>
        searchString.length >= 3 ? this.searchService.search(searchString) : of([])
      ),
      share(),
      tap(() => this.isLoadingResults = false)
    );
  }

  ngAfterViewInit() {
    this.searchInput.nativeElement.focus();
    this.cdRef.detectChanges();
  }

  register(option: string, voter: any) {
    // if (!this.printerService.printCharacteristic) {
    //   this.printerService.messageConnectPrinter();
    //   return;
    // }

    let vote: Observable<any>
    Swal.fire({
      title: `¿Confirmar voto por ${option}?`,
      showDenyButton: true,
      // showCancelButton: true,
      denyButtonText: `Cancelar`,
      confirmButtonText: 'Registar',
      confirmButtonColor: '#00d203',
      reverseButtons: true
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        if (option === 'MPLD') {
          vote = this.basePersonalService.voteFavor(voter.id);
        } else if (option === 'attendance') {
          vote = this.basePersonalService.voteAttendance(voter.id);
        } else {
          vote = this.basePersonalService.voteNoFavor(voter.id);
        }
        vote.subscribe(res => {
          Swal.fire('Voto registrado', 'Se imprimira el comprobante', 'success');
          const searchString$ = merge(
            defer(() => of(this.searchControl.value)),
            this.searchControl.valueChanges
          ).pipe(
            debounceTime(1000),
            distinctUntilChanged()
          );
          this.searchResults$ = searchString$.pipe(
            tap(() => this.isLoadingResults = true),
            switchMap((searchString: string) =>
              this.searchService.search(searchString)
            ),
            share(),
            tap(() => this.isLoadingResults = false),
          );
        })
        this.printerService.printTicket(voter, option);
      }
    })
  }

  createUser(person: any) {
    Swal.fire({
      title: `¿Estas seguro de crear un usuario para ${person.name} ${person.last_name} ${person.mother_last_name}?`,
      showDenyButton: true,
      denyButtonText: `Cancelar`,
      confirmButtonText: 'Crear Usuario',
      confirmButtonColor: '#00d203',
      reverseButtons: true
    }).then(
      (result) => {
        if (result.isConfirmed) {
          this.basePersonalService.createUser(person.id).subscribe(
            (user: any) => {
              Swal.fire('Usuario Creado', `Se ha creado el usuario, contraseña: ${user.password}`, 'success')
            }, () => {
              Swal.fire('Servicio no disponible', 'Algo ha salido mal', 'error')
            }
          );
        }
      }
    );
  }

  promoteVoter(voter: any) {
    const fullName = `${voter.name} ${voter.last_name} ${voter.mother_last_name}`;
    Swal.fire({
      title: `¿Estas seguro de promover a  ${fullName}?`,
      showDenyButton: true,
      denyButtonText: `Cancelar`,
      confirmButtonText: 'Promover votante',
      confirmButtonColor: '#00d203',
      reverseButtons: true
    }).then(
      (result) => {
        if (result.isConfirmed) {
          this.referredService.create(voter.id).subscribe(
            () => {
              Swal.fire('Votante Promovido', `Haz promovido con éxito a ${fullName}`, 'success')
            }, () => {
              Swal.fire('Servicio no disponible', 'Algo ha salido mal', 'error')
            }
          );
        }
      }
    )
  }

  updateInformation(voter: any) {
    const fullName = `${voter.name} ${voter.last_name} ${voter.mother_last_name}`;
    const {phone_number, expedient} = voter;
    Swal.fire({
      title: `Actualizando información de ${fullName}`,
      html: `
                <input type="tel" id="phoneSwal" class="swal2-input" placeholder="Teléfono">
                <input type="text" id="recordSwal" class="swal2-input" placeholder="Expediente">`,
      confirmButtonText: 'Actualizar Información',
      showCancelButton: true,
      confirmButtonColor: '#00d203',
      cancelButtonText: 'Omitir',
      focusConfirm: false,
      allowOutsideClick: false,
      didOpen: (popup: HTMLElement) => {
        const phone = (document.querySelector('#phoneSwal') as HTMLInputElement);
        const record = (document.querySelector('#recordSwal') as HTMLInputElement);

        phone.value = phone_number || '';
        record.value = expedient || '';
      },
      preConfirm: () => {
        const phone = (document.querySelector('#phoneSwal') as HTMLInputElement).value;
        const record = (document.querySelector('#recordSwal') as HTMLInputElement).value;
        if (!phone || !record) {
          Swal.showValidationMessage(`Ambos campos son requeridos`);
        }

        return {record, phone};
      }
    }).then((result: any) => {
      console.log({result, voter});
      if (result.isConfirmed) {
        const info = {
          phone_number: result.value.phone,
          expedient: result.value.record,
        };
        this.basePersonalService.updateBasePersonal(voter.id, info).subscribe(
          () => {
            Swal.fire('Información Actualizada', `La información de ${fullName} ha sido actualizada correctamente`, 'success');
            const searchString$ = merge(
              defer(() => of(this.searchControl.value)),
              this.searchControl.valueChanges
            ).pipe(
              debounceTime(1000),
              distinctUntilChanged()
            );
            this.searchResults$ = searchString$.pipe(
              tap(() => this.isLoadingResults = true),
              switchMap((searchString: string) =>
                this.searchService.search(searchString)
              ),
              share(),
              tap(() => this.isLoadingResults = false),
            );
          }, () => {
            Swal.fire('Algo salio mal...', `Servicio no disponible`, 'error');
          }
        );
      }
    });
  }


  passAttendance(person: any) {
    // if (!this.printerService.printCharacteristic) {
    //   this.printerService.messageConnectPrinter();
    //   return;
    // }
    const fullName = `${person.name} ${person.last_name} ${person.mother_last_name}`;
    const randNumber = this.attendanceService.generateRandomNumber();
    if(this.assembly) {
      this.attendanceService.passAttendance(this.assembly, person).subscribe({
        next: () => {
              Swal.fire(`Pase de lista`, `${fullName} confirmo asistencia`, 'success');
              this.printerService.printAttendanceTicket(person, randNumber).then(r => {
              });
        },
        error: ({error}) => {
          console.log(error);
              Swal.fire('Algo salio mal...', error.error, 'error');
        }
      })
    }

    // this.attendanceService.passAttendance(person.id, randNumber).subscribe(
    //   response => {
    //     Swal.fire(`Pase de lista`, `${fullName} confirmo asistencia`, 'success');
    //     this.printerService.printAttendanceTicket(person, randNumber).then(r => {
    //     });
    //   }, () => {
    //     Swal.fire('Algo salio mal...', `Servicio no disponible`, 'error');
    //   }
    // );
  }

  showInformation(person: any) {
    console.log(person);
    const fullName = `${person.name} ${person.last_name} ${person.mother_last_name}`;
    let htmlArray = [
      // '<div class="container">',
      '<div class="container">',
      '<div class="row">',
      '<div class="col-6"><span class="dialog__label">Nombre Completo:</span></div>',
      `<div class="col-6"><span class="dialog__value">${fullName}</span></div>`,
      '<div class="col-6"><span class="dialog__label">ID de registro:</span></div>',
      `<div class="col-6"><span class="dialog__value">${person.id_register}</span></div>`,
      person.affiliation_area ? '<div class="col-6"><span class="dialog__label">Area de Adscripción:</span></div>' +
        `<div class="col-6"><span class="dialog__value">${person.affiliation_area}</span></div>` : '',
      person.exercise ? '<div class="col-6"><span class="dialog__label">Ejercicio:</span></div>' +
        `<div class="col-6"><span class="dialog__value">${person.exercise}</span></div>` : '',
      person.cve_job_level ? '<div class="col-6"><span class="dialog__label">Clave Cat:</span></div>' +
        `<div class="col-6"><span class="dialog__value">${person.cve_job_level}</span></div>` : '',
      person.denomination_jod_description ? '<div class="col-6"><span class="dialog__label">Descripción Del Puesto:</span></div>' +
        `<div class="col-6"><span class="dialog__value">${person.denomination_jod_description}</span></div>` : '',
      person.denomination_jod ? '<div class="col-6"><span class="dialog__label">Denominacion Del Cargo:</span></div>' +
        `<div class="col-6"><span class="dialog__value">${person.denomination_jod}</span></div>` : '',
      person.gender ? '<div class="col-6"><span class="dialog__label">Sexo:</span></div>' +
        `<div class="col-6"><span class="dialog__value">${person.gender}</span></div>` : '',
      person.gross_monthly_amount ? '<div class="col-6"><span class="dialog__label">Monto Mensual Bruto:</span></div>' +
        `<div class="col-6"><span class="dialog__value">${person.gross_monthly_amount}</span></div>` : '',
      person.currency_type_of_gross_remuneration ? '<div class="col-6"><span class="dialog__label">Tipo de Moneda de La Remuneración Bruta:</span></div>' +
        `<div class="col-6"><span class="dialog__value">${person.currency_type_of_gross_remuneration}</span></div>` : '',
      person.net_monthly_amount ? '<div class="col-6"><span class="dialog__label">Monto Mensual Neto:</span></div>' +
        `<div class="col-6"><span class="dialog__value">${person.net_monthly_amount}</span></div>` : '',
      person.net_remuneration_currency_type ? '<div class="col-6"><span class="dialog__label">Tipo de Moneda de La Remuneración Neta:</span></div>' +
        `<div class="col-6"><span class="dialog__value">${person.net_remuneration_currency_type}</span></div>` : '',
      person.phone_number ? '<div class="col-6"><span class="dialog__label">Télefono:</span></div>' +
        `<div class="col-6"><span class="dialog__value">${person.phone_number}</span></div>` : '',
      person.list_number ? '<div class="col-6"><span class="dialog__label">Número de Lista:</span></div>' +
        `<div class="col-6"><span class="dialog__value">${person.list_number}</span></div>` : '',
      '</div>',
      '</div>'
    ];
    Swal.fire({
      title: `Información completa de ${fullName}`,
      html: htmlArray.join(''),
      icon: "info",
      confirmButtonText: 'Cerrar',
      confirmButtonColor: '#DC107E',
    }).then(r => {
    });
  }
}
