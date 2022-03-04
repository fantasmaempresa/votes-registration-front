import {Injectable} from '@angular/core';
import Swal from "sweetalert2";

const SPACE_CONSTANT = '\u000A\u000D';

@Injectable({
  providedIn: 'root'
})
export class PrinterService {
  PRINTER_UUID = '0000180f-0000-1000-8000-00805f9b34fb'
  public printCharacteristic: any = null;

  constructor() {
  }

  printTicket(voter: any, option: string) {
    if (this.printCharacteristic !== null) {
      this.printVoteTicket(voter, option).then(() => console.log('Terminado'));
    }
  }

  printAddBaseStaffTicket(staff: any) {
    if (this.printCharacteristic !== null) {
      this.printBaseStaffTicket(staff,).then(() => console.log('Terminado'));
    }
  }

  async printBaseStaffTicket(staff: any) {
    let date = new Date().toISOString();
    let text =
      SPACE_CONSTANT
      + SPACE_CONSTANT
      + `${staff.name} ${staff.last_name} ${staff.mother_last_name}`
      + SPACE_CONSTANT
      + SPACE_CONSTANT
      + `${staff.dependency}`
      + SPACE_CONSTANT
      + 'AREA'
      + `${staff.affiliation_area}`;
    await this.writeText(text);
    text =
      SPACE_CONSTANT
    + `${date}`
    + SPACE_CONSTANT
    + SPACE_CONSTANT
    + SPACE_CONSTANT
    + SPACE_CONSTANT;
    await this.writeText(text);
  }

  async printVoteTicket(voter: any, option: string) {
    let date = new Date().toISOString()
    let text =
      SPACE_CONSTANT
      + SPACE_CONSTANT
      + `${voter.name} ${voter.last_name} ${voter.mother_last_name}`
      + SPACE_CONSTANT
      + SPACE_CONSTANT
      + 'ADSC'
      + SPACE_CONSTANT
      + `${voter.dependency}`
      + SPACE_CONSTANT
      + 'AREA'
      + `${voter.affiliation_area}`;
    await this.writeText(text);
    text = SPACE_CONSTANT
      + 'INFORMACION OBTENIDA DE LA '
      + 'PLATAFORMA NACIONAL DE TRANSPARENCIA'
      + SPACE_CONSTANT
      + SPACE_CONSTANT
      + 'https://www.plataformadetransparencia.org.mx'
      + SPACE_CONSTANT
      + `${option} -`
      + `${date}`
      + SPACE_CONSTANT
      + SPACE_CONSTANT
      + SPACE_CONSTANT
      + SPACE_CONSTANT;
    await this.writeText(text);
    // Print an image followed by the text

  }

  findDevice() {
    if (this.printCharacteristic === null) {
      const mobileNavigatorObject: any = window.navigator;
      mobileNavigatorObject.bluetooth.requestDevice({
        filters: [{
          name: '58HB6',
        }],
        optionalServices: ['0000ff00-0000-1000-8000-00805f9b34fb']
      })
        .then((device: any) => {
          Swal.fire("Conectando con dispositivo", '', 'info');
          Swal.showLoading();
          console.log('> Found ' + device.name);
          console.log('Connecting to GATT Server...');
          // @ts-ignore
          return device.gatt.connect();
        })
        .then((server: any) => server.getPrimaryService('0000ff00-0000-1000-8000-00805f9b34fb'))
        .then((service: any) => service.getCharacteristic('0000ff02-0000-1000-8000-00805f9b34fb'))
        .then((characteristic: any) => {
          this.printCharacteristic = characteristic;
          Swal.fire('Conectado con la impresora', '', 'success');
          console.log('Impresora conectada', this.printCharacteristic);
          // this.sendPrinterData(voter, option).then(() => console.log('Terminado'));
        })
        .catch((e: any) => {
          Swal.fire('Algo salio mal', 'Intenta apagar el dispositivo y reconectarlo', 'error');
          console.log(e);
        })
    }
  }

  async writeText(text: string) {
    const encoder = new TextEncoder();
    let textEncoder = encoder.encode(text);
    console.log(textEncoder);
    await this.printCharacteristic.writeValue(textEncoder);
  }

  messageConnectPrinter() {
    Swal.fire("Impresora no conectada aún", "Conecta la impresora primero, presionando el botón rojo en la esquina superior derecha", "warning");
  }

  async printAttendanceTicket(person: any, randNumber: string) {
    const date = new Date().toISOString()
    let text =
      SPACE_CONSTANT
      + SPACE_CONSTANT
      + SPACE_CONSTANT
      + `${person.name} ${person.last_name} ${person.mother_last_name}`
      + SPACE_CONSTANT
      + SPACE_CONSTANT
      + '# de Comprobacion'
      + SPACE_CONSTANT
      + `${randNumber}`
      + SPACE_CONSTANT
      + SPACE_CONSTANT
      + 'Fecha:'
      + SPACE_CONSTANT
      + `${date}`
      + SPACE_CONSTANT
      + SPACE_CONSTANT
      + SPACE_CONSTANT
      + SPACE_CONSTANT;
    await this.writeText(text);
  }
}
