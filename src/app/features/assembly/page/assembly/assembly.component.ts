import {AfterViewInit, Component, SecurityContext, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {Observable, switchMap, tap} from "rxjs";
import {FilterService} from "../../../../core/services/filter.service";
import {ActivatedRoute} from "@angular/router";
import {FormControl} from "@angular/forms";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

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
      label: 'Firmas para asamblea',
      link: './signatures',
      index: 1
    },
    {
      label: 'Resumen de firmas',
      link: './resume',
      index: 2
    },
  ];
  activeLink = this.links[0];
}
