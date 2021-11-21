import {Component, OnInit} from '@angular/core';
import Swal from 'sweetalert2'
import {FormControl} from "@angular/forms";
import {
    debounceTime,
    defer,
    distinctUntilChanged,
    filter,
    map,
    merge,
    Observable,
    of,
    share,
    switchMap,
    tap
} from "rxjs";
import {SearchService} from "../../../../core/services/search.service";


@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
    // define your services and characteristics
    PRINTER_UUID = '0000180f-0000-1000-8000-00805f9b34fb'
    printCharacteristic: any = null;
    searchControl!: FormControl;
    searchResults$!: Observable<any>;
    public areMinimumCharactersTyped$!: Observable<boolean>;
    public areNoResultsFound$!: Observable<boolean>;
    isLoadingResults = false;

    constructor(private searchService: SearchService) {
    }

    ngOnInit(): void {
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
                if(option === 'MPLD') {
                    vote = this.searchService.voteFavor(voter.id);
                } else if ('attendance') {
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
}
