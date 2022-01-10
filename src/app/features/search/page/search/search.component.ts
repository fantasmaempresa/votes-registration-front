import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import Swal from 'sweetalert2'
import {FormControl} from "@angular/forms";
import {debounceTime, defer, distinctUntilChanged, map, merge, Observable, of, share, switchMap, tap} from "rxjs";
import {SearchService} from "../../../../core/services/search.service";
import {BasePersonalService} from "../../../../core/services/base-personal.service";
import {ReferredService} from "../../../../data/services/referred.service";
import {AuthService} from "../../../../core/services/auth.service";
import {UserModel} from "../../../../data/models/user.model";


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, AfterViewInit {
  @ViewChild("searchInput") searchInput!: ElementRef;
  // define your services and characteristics
  PRINTER_UUID = '0000180f-0000-1000-8000-00805f9b34fb'
  printCharacteristic: any = null;
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
  }

  async sendPrinterData(voter: any, option: string) {
    let encoder = new TextEncoder();
    let date = new Date().toISOString()
    let ticket = '\u000A\u000D'
      + '\u000A\u000D'
      + `${voter.name} ${voter.last_name} ${voter.mother_last_name}`
      + '\u000A\u000D'
      + '\u000A\u000D'
      + 'ADSC'
      + '\u000A\u000D'
      + `${voter.dependency}`
      + '\u000A\u000D'
      + 'AREA'
      + `${voter.affiliation_area}`;
    let text = encoder.encode(ticket);
    console.log(text);
    await this.printCharacteristic.writeValue(text);
    text = encoder.encode('\u000A\u000D'
      + 'INFORMACION OBTENIDA DE LA '
      + 'PLATAFORMA NACIONAL DE TRANSPARENCIA'
      + '\u000A\u000D'
      + '\u000A\u000D'
      + 'https://www.plataformadetransparencia.org.mx'
      + '\u000A\u000D'
      + `${option} -`
      + `${date}`
      + '\u000A\u000D'
    );
    await this.printCharacteristic.writeValue(text);
    // Print an image followed by the text

  }

  printTicket(voter: any, option: string) {
    let mobileNavigatorObject: any = window.navigator;
    if (this.printCharacteristic === null) {
      mobileNavigatorObject.bluetooth.requestDevice({
        filters: [{
          name: '58HB6',
        }],
        optionalServices: ['0000ff00-0000-1000-8000-00805f9b34fb']
      })
        .then((device: any) => {
          console.log('> Found ' + device.name);
          console.log('Connecting to GATT Server...');
          // @ts-ignore
          return device.gatt.connect();
        })
        .then((server: any) => server.getPrimaryService('0000ff00-0000-1000-8000-00805f9b34fb'))
        .then((service: any) => service.getCharacteristic('0000ff02-0000-1000-8000-00805f9b34fb'))
        .then((characteristic: any) => {
          this.printCharacteristic = characteristic;
          this.sendPrinterData(voter, option).then(() => console.log('Terminado'));
        })
        .catch((e: any) => console.log(e))
    } else {
      this.sendPrinterData(voter, option).then(() => console.log('Terminado'));
    }
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
        this.printTicket(voter, option);
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


}
