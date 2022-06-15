import {Inject, Injectable} from '@angular/core';
import {CanActivate, Router, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from "../services/auth.service";
import {WINDOW} from "../providers/window.provider";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private authService: AuthService, @Inject(WINDOW) private window: Window,) {
    }
  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const hostname = window.location.hostname
    console.log(hostname)
      if(hostname === 'coalicion2022-stspepyod.info.com' || hostname === 'votes-registration-front.vercel.app') {
        this.router.navigate(['/docs'])
      }
      if (this.authService.isLoggedIn()) {
          this.router.navigate(['/app']);
      }
      return !this.authService.isLoggedIn();
  }

}
