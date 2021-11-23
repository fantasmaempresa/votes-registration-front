import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest} from "@angular/common/http";
import {BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError} from "rxjs";
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class JwtInterceptor {
    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor(public authService: AuthService, private router: Router) {
    }

    public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.authService.getJwtToken()) {
            req = JwtInterceptor.addToken(req, this.authService.getJwtToken());
        }
        return next.handle(req).pipe(
            catchError(error => {
                if (error instanceof HttpErrorResponse && !req.url.includes('auth/login') && error.status === 401) {
                    return this.handle401Error(req, next);
                } else {
                    return throwError(error);
                }
            })
        )
    }

    private static addToken(request: HttpRequest<any>, token: string | null) {
        return request.clone({
            setHeaders: {
                'Authorization': `Bearer ${token}`
            }
        });
    }

    private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);

            return this.authService.refreshToken()
                .pipe(
                    switchMap((token: any) => {
                        this.isRefreshing = false;
                        this.refreshTokenSubject.next(token.access_token);
                        return next.handle(JwtInterceptor.addToken(request, token.access_token));
                    }),
                    catchError(() => this.router.navigate(['auth']))
                );
        } else {
            return this.refreshTokenSubject.pipe(
                filter(token => token != null),
                take(1),
                switchMap(jwt => {
                    return next.handle(JwtInterceptor.addToken(request, jwt));
                }));
        }
    }
}
