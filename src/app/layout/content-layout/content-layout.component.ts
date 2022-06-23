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
    if(user && user.type === 1) {
      this.socketService.subscribeToChannel('oauth', 'OauthEvent', ({user}: any) => {
        Swal.fire({
          title: `El usuario ${user.email} esta intentando conectarse`,
          showDenyButton: true,
          denyButtonText: `Denegar`,
          confirmButtonText: 'Autorizar',
          confirmButtonColor: '#00d203',
          reverseButtons: true
        }).then((result) => {
          if (result.isConfirmed) {
            this.authService.authorizeLogin(user.id).subscribe(res => console.log(res));
          } else {
            this.authService.unauthorizeLogin(user.id).subscribe(res => console.log(res));
          }
        });
      });
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddBaseStaffComponent, {});
    dialogRef.afterClosed().subscribe(result => {
      console.log('Todo chido')
    })
  }
}
