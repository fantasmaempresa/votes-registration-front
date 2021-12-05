import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../core/services/auth.service";
import {UserModel} from "../../data/models/user.model";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  user!: UserModel;

  constructor(private router: Router, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.user = this.authService.getUser();
  }

  async logout() {
    this.authService.logout();
    await this.router.navigateByUrl('auth');
  }

}
