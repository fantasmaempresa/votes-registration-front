import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from "../services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class AppGuard implements CanLoad {
  constructor(private authService: AuthService, private router: Router) { }
  canLoad(route: Route) {
    const user = this.authService.getUser();
    if(user) {
      // @ts-ignore
      if(route.data.roles && route.data.roles.indexOf(user.type) === -1) {
        this.router.navigate(['/app']);
        return false;
      }
      return true
    }
    this.router.navigate(['/auth']);
    return false
  }

  // canLoad() {
  //   if (!this.authService.isLoggedIn()) {
  //     this.router.navigate(['/auth']);
  //   }
  //   return this.authService.isLoggedIn();
  // }
}
