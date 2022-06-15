import {Component, Inject} from '@angular/core';
import {WINDOW} from "./core/providers/window.provider";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor() {
    // const host = window.location.hostname
    // if(host !== 'movimientoporlademocracia.com') {
    //
    // }
    // console.log(window.location.hostname);
  }
  title = 'voter-registration';
}
