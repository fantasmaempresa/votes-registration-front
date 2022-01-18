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


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, AfterViewInit {
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
    private cdRef: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
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
    let vote: Observable<any>
    Swal.fire({
      title: `¿Confirmar voto por ${option}`,
      showDenyButton: true,
      // showCancelButton: true,
      denyButtonText: `Cancelar`,
      confirmButtonText: 'Registar',
      confirmButtonColor: '#00d203',
      reverseButtons: true
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire('Voto registrado', 'Se imprimira el comprobante', 'success');
        if (option === 'MPLD') {
          vote = this.searchService.voteFavor(voter.id);
        } else if (option === 'attendance') {
          vote = this.searchService.voteAttendance(voter.id);
        } else {
          vote = this.searchService.voteNoFavor(voter.id);
        }
        vote.subscribe(res => {
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
    const fullName = `${person.name} ${person.last_name} ${person.mother_last_name}`;
    const randNumber = this.attendanceService.generateRandomNumber();

    this.attendanceService.passAttendance(person.id, randNumber).subscribe(
      response => {
        Swal.fire(`Pase de lista`, `${fullName} confirmo asistencia`, 'success');
      }, () => {
        Swal.fire('Algo salio mal...', `Servicio no disponible`, 'error');
      }
    );
  }
}
