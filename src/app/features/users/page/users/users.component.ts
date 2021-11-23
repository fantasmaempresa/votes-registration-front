import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {UserService} from "../../../../data/services/user.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users$!: Observable<any>;

  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.users$ = this.userService.fetchAll();
  }

  rediretToNewUser() {
    this.router.navigate(['new'], {relativeTo: this.route.parent})
  }

}
