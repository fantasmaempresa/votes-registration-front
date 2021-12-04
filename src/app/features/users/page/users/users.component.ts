import {Component, OnInit} from '@angular/core';
import {map, Observable, pluck} from "rxjs";
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
    this.users$ = this.userService.fetchAll().pipe(
      pluck('data'),
      map(
        (users: any[]) => {
          console.log(users);
          return users.filter(user => user.id !== 1);
        },
      )
    );
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

  setPassword(user: any) {
    Swal.fire({
      title: `Cambiar Contraseña para ${user.email}`,
      html: `
                <input type="password" id="passwordSwal" class="swal2-input" placeholder="Password">
                <input type="password" id="confirmPasswordSwal" class="swal2-input" placeholder="Confirmar Password">`,
      confirmButtonText: 'Actualizar',
      showCancelButton: true,
      confirmButtonColor: '#00d203',
      cancelButtonText: 'No quiero actualizar',
      focusConfirm: false,
      allowOutsideClick: false,
      preConfirm: () => {
        const password = (document.querySelector('#passwordSwal') as HTMLInputElement).value;
        const confirmPassword = (document.querySelector('#confirmPasswordSwal') as HTMLInputElement).value;
        if (!password || !confirmPassword) {
          Swal.showValidationMessage(`Ambos campos son requeridos`);
        } else if (password.length < 6) {
          Swal.showValidationMessage(`Deben ser por lo menos 6 caracteres`);
        } else if (password !== confirmPassword) {
          Swal.showValidationMessage(`Ambas contraseñas deben ser iguales`);
        }
        return {confirmPassword, password};
      }
    }).then((result: any) => {
      if (result.isConfirmed) {
        user.password = result.value.password;
        this.userService.update(user).subscribe(
          () => {
            Swal.fire('Contraseña Actualizada', `La contraseña de ${user.email} fue actualizada con éxito`, 'success');
          }, () => {
            Swal.fire('Algo salio mal...', `Servicio no disponible`, 'error');
          }
        );
      }
    });
  }
}
