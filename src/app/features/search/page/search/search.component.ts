import {Component, OnInit} from '@angular/core';
import Swal from 'sweetalert2'
import {BluetoothCore} from "@manekinekko/angular-web-bluetooth";
import {map, mergeMap, Observable} from "rxjs";


@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
    people = [
        {
            id: '46188243',
            name: 'Luis',
            lastname: 'Osorio',
            area: 'Direccion general de administracion',
            puesto: 'Analista',
            clave: 'G-1308',
        },
        {
            id: '46188243',
            name: 'Luis',
            lastname: 'Osorio',
            area: 'Direccion general de administracion',
            puesto: 'Analista',
            clave: 'G-1308',
        },
        {
            id: '46188243',
            name: 'Luis',
            lastname: 'Osorio',
            area: 'Direccion general de administracion',
            puesto: 'Analista',
            clave: 'G-1308',
        },
        {
            id: '46188243',
            name: 'Luis',
            lastname: 'Osorio',
            area: 'Direccion general de administracion',
            puesto: 'Analista',
            clave: 'G-1308',
        },
        {
            id: '46188243',
            name: 'Luis',
            lastname: 'Osorio',
            area: 'Direccion general de administracion',
            puesto: 'Analista',
            clave: 'G-1308',
        },
        {
            id: '46188243',
            name: 'Luis',
            lastname: 'Osorio',
            area: 'Direccion general de administracion',
            puesto: 'Analista',
            clave: 'G-1308',
        },
        {
            id: '46188243',
            name: 'Luis',
            lastname: 'Osorio',
            area: 'Direccion general de administracion',
            puesto: 'Analista',
            clave: 'G-1308',
        },


    ]

    // define your services and characteristics
    PRINTER_UUID = '0000180f-0000-1000-8000-00805f9b34fb'


    printCharacteristic: any = null;

    constructor() {
    }

    ngOnInit(): void {
    }


    async sendPrinterData(voter: any) {
        let encoder = new TextEncoder();
        let ticket = '\u000A\u000D'
        + '\u000A\u000D'
        + '\u000A\u000D'
        + '\u000A\u000D'
        + `${voter.name}-${voter.lastname}`
        + '\u000A\u000D'
        + '\u000A\u000D'
        + `${voter.area}`
        + '\u000A\u000D'
        + '\u000A\u000D'
        + 'INFORMACION OBTENIDA DE LA PLATAFORMA NACIONAL DE TRANSPARENCIA'
        + '\u000A\u000D'
        + '\u000A\u000D'
        + 'https://www.plataformadetransparencia.org.mx'
        + '\u000A\u000D'
        + '\u000A\u000D'
        + '\u000A\u000D'
        + '\u000A\u000D';
        let text = encoder.encode(ticket);
        console.log(text);
        await this.printCharacteristic.writeValue(text);
        // Print an image followed by the text

    }

    printTicket(voter: any) {
        if (this.printCharacteristic === null) {
            navigator.bluetooth.requestDevice({
                filters: [{
                    name: '58HB6',
                }],
                optionalServices: ['0000ff00-0000-1000-8000-00805f9b34fb']
            })
                .then(device => {
                    console.log('> Found ' + device.name);
                    console.log('Connecting to GATT Server...');
                    // @ts-ignore
                    return device.gatt.connect();
                })
                .then(server => server.getPrimaryService('0000ff00-0000-1000-8000-00805f9b34fb'))
                .then(service => service.getCharacteristic('0000ff02-0000-1000-8000-00805f9b34fb'))
                .then(characteristic => {
                    this.printCharacteristic = characteristic;
                    this.sendPrinterData(voter);
                })
                .catch(e => console.log(e))
        } else {
            this.sendPrinterData(voter);
        }
    }

    register(option: string, voter: Object) {
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
                this.printTicket(voter);
            }
        })
    }
}
