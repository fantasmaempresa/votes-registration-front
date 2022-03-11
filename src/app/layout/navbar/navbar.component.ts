import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../core/services/auth.service";
import {UserModel} from "../../data/models/user.model";
import {PrinterService} from "../../core/services/printer.service";
import {AddBaseStaffComponent} from "../../shared/components/dialog/add-base-staff/add-base-staff.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  user!: UserModel;

  constructor(private router: Router, private authService: AuthService, private printerService: PrinterService,
              public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.user = this.authService.getUser();
  }

  async logout() {
    this.authService.logout();
    await this.router.navigateByUrl('auth');
  }

  findDevice() {
    this.printerService.findDevice();
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddBaseStaffComponent, {
      data: {
        text: 'Agregar personal de base',
        edit: false
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('Todo chido')
    })
  }
}
