import { Component, OnInit } from '@angular/core';
import {SocketService} from "../../core/services/socket.service";
import {AuthService} from "../../core/services/auth.service";

@Component({
  selector: 'app-content-layout',
  templateUrl: './content-layout.component.html',
  styleUrls: ['./content-layout.component.scss']
})
export class ContentLayoutComponent implements OnInit {

  constructor(private socketService: SocketService, private authService: AuthService) { }

  ngOnInit(): void {
    // @ts-ignore
    let user: any = JSON.parse(localStorage.getItem('user'));
    console.log(user);
    if(user.type === 1) {
      console.log('Soy admin estoy esperando usuarios')
      this.socketService.subscribeToChannel('oauth', 'OauthEvent', (data: any) => {
        console.log(data);
      });
      // this.socketService.subscribeToChannel('authorize', 'AuthorizeLoginEvent', (data: any) => {
      //   console.log(data);
      // });
    }
  }

}
