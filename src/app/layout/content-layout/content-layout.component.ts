import {Component, OnInit} from '@angular/core';
import {SocketService} from "../../core/services/socket.service";
import {AuthService} from "../../core/services/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import Swal from "sweetalert2";
import {MatDialog} from "@angular/material/dialog";
import {AddBaseStaffComponent} from "../../shared/components/dialog/add-base-staff/add-base-staff.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-content-layout',
  templateUrl: './content-layout.component.html',
  styleUrls: ['./content-layout.component.scss']
})
export class ContentLayoutComponent implements OnInit {

  constructor(private socketService: SocketService,
              private authService: AuthService,
              private snackBar: MatSnackBar,
              public dialog: MatDialog,
              private router: Router
  ) {

  }

  ngOnInit(): void {
    // @ts-ignore
    let user: any = JSON.parse(localStorage.getItem('user'));
    console.log(user);
    if(user.type === 1) {
      console.log('Soy admin estoy esperando usuarios')
      this.socketService.subscribeToChannel('oauth', 'OauthEvent', ({user}: any) => {

        Swal.fire({
          title: `El usuario ${user.email} esta intentando conectarse`,
          showDenyButton: true,
          // showCancelButton: true,
          denyButtonText: `Denegar`,
          confirmButtonText: 'Autorizar',
          confirmButtonColor: '#00d203',
          reverseButtons: true
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            this.authService.authorizeLogin(user.id).subscribe(res => console.log(res));
          } else {
            this.authService.unauthorizeLogin(user.id).subscribe(res => console.log(res));
          }
        })
        // this.openSnackBar(`El usuario ${user.email} esta intentando conectarse`, 'Aceptar');
      });
      // this.socketService.subscribeToChannel('authorize', 'AuthorizeLoginEvent', (data: any) => {
      //   console.log(data);
      // });
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action);
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddBaseStaffComponent, {});
    dialogRef.afterClosed().subscribe(result => {
      console.log('Todo chido')
    })
  }

}
