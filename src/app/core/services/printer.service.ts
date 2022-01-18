import {Injectable} from '@angular/core';

const SPACE_CONSTANT = '\u000A\u000D';

@Injectable({
  providedIn: 'root'
})
export class PrinterService {
  PRINTER_UUID = '0000180f-0000-1000-8000-00805f9b34fb'
  printCharacteristic: any = null;

  constructor() {
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


  async sendPrinterData(voter: any, option: string) {
    let encoder = new TextEncoder();
    let date = new Date().toISOString()
    let ticket =
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
    let text = encoder.encode(ticket);
    console.log(text);
    await this.printCharacteristic.writeValue(text);
    text = encoder.encode(SPACE_CONSTANT
      + 'INFORMACION OBTENIDA DE LA '
      + 'PLATAFORMA NACIONAL DE TRANSPARENCIA'
      + SPACE_CONSTANT
      + SPACE_CONSTANT
      + 'https://www.plataformadetransparencia.org.mx'
      + SPACE_CONSTANT
      + `${option} -`
      + `${date}`
      + SPACE_CONSTANT
    );
    await this.printCharacteristic.writeValue(text);
    // Print an image followed by the text

  }

}
