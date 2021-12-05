import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import Swal from "sweetalert2";
import {ReferredService} from "../../../../data/services/referred.service";

@Component({
  selector: 'app-referred',
  templateUrl: './referred.component.html',
  styleUrls: ['./referred.component.scss']
})
export class ReferredComponent implements OnInit {
  referrers$!: Observable<any>;

  constructor(private referredService: ReferredService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.referrers$ = this.referredService.fetchAll();
  }

  deleteReferred(user: any) {
    Swal.fire({
      title: `¿Estas seguro de borrar este promovido: ${user.name} ${user.last_name} ${user.mother_last_name}?`,
      showDenyButton: true,
      denyButtonText: `Cancelar`,
      denyButtonColor: '#bbb',
      confirmButtonText: 'Borrar Promovido',
      confirmButtonColor: '#d20003',
      reverseButtons: true,
      icon: 'question',
    }).then(
      result => {
        if (result.isConfirmed) {
          this.referredService.delete(user.id).subscribe(
            () => {
              Swal.fire('Promovido borrado', `Se ha borrado el promovido: ${user.name} ${user.last_name} ${user.mother_last_name}`, 'success');
              this.ngOnInit();
            },
            () => {
              Swal.fire('Ocurrió un error', `Servicio no disponible`, 'error');
            }
          );
        }
      }
    );
  }

}
