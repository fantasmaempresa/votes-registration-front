import {Component} from '@angular/core';

@Component({
  selector: 'app-assembly',
  templateUrl: './assembly.component.html',
  styleUrls: ['./assembly.component.scss']
})
export class AssemblyComponent {
  links = [
    {
      label: 'Historial',
      link: './history',
      index: 0
    },
    {
      label: 'Listas de asistencia',
      link: './signatures',
      index: 1
    }
  ];
  activeLink = this.links[0];
}
