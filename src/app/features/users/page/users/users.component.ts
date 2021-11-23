import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {UserService} from "../../../../data/services/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users$!: Observable<any>;

  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.users$ = this.userService.fetchAll();
  }

  redirectToNewUser() {
    this.router.navigate(['new'], {relativeTo: this.route.parent})
  }

  deleteUser(user: any) {
    if (user.id === 1) {
      Swal.fire('Acción prohibida', 'No puedes borrar este usuario', 'error');
      return;
    }

    Swal.fire({
      title: `¿Estas seguro de borrar el usuario para ${user.email}?`,
      showDenyButton: true,
      denyButtonText: `Cancelar`,
      denyButtonColor: '#bbb',
      confirmButtonText: 'Borrar Usuario',
      confirmButtonColor: '#d20003',
      reverseButtons: true,
      icon: 'question',
    }).then(
      result => {
        if (result.isConfirmed) {
          this.userService.delete(user.id).subscribe(
            () => {
              Swal.fire('Usuario borrado', `Se ha borrado el usuario de ${user.email}`, 'success');
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
