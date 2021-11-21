import { Injectable } from '@angular/core';
import {HttpEvent, HttpHandler, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptor {

  constructor() { }

  public intercept( req: HttpRequest<any>,
                    next: HttpHandler ): Observable<HttpEvent<any>> {
    const authorizationReq = this.setAuthHeader(req);
    return next.handle(authorizationReq);
  }

  private setAuthHeader(req: HttpRequest<any>): HttpRequest<any> {
    const token = localStorage.getItem('token');
    const authorization = `Bearer ${token}`;
    const headers = req.headers.set('Authorization', authorization);
    return req.clone({headers});
  }
}
