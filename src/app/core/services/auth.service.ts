import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Tokens} from "../../data/models/tokens";
import {map, tap} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly JWT_TOKEN = 'JWT_TOKEN';
    private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';

    constructor(public http: HttpClient) {
    }

    tryOfLogin({username, password}: any) {
        let url = `${environment.base_url}/requestToLogin`;
        let body = {
            username,
            password
        };
        return this.http.post(url, body).pipe(
            map((data: any) => data.data)
        );
    }

    login({username, password}: any) {
        let url = `${environment.base_url}/oauth/token`;
        let body = {
            grant_type: environment.grant_type,
            client_id: environment.client_id,
            client_secret: environment.client_secret,
            username,
            password
        };
        return this.http.post(url, body);
    }

    authorizeLogin(id: number) {
        let url = `${environment.base_url}/authorizeUser/${id}`
        return this.http.get(url);
    }

    unauthorizeLogin(id: number) {
        let url = `${environment.base_url}/notAuthorizeUser/${id}`;
        return this.http.get(url);
    }

    getDataUserLogged() {
        let url = `${environment.base_url}/getDataUserLogged`
        return this.http.get(url).pipe(
            map((data:any) => data.data)
        );
    }

    logout() {
        this.doLogoutUser();
    }

    isLoggedIn() {
        return !!this.getJwtToken();
    }

    refreshToken() {
        let body = {
            grant_type: 'refresh_token',
            client_id: environment.client_id,
            client_secret: environment.client_secret,
            refresh_token: this.getRefreshToken()
        }
        return this.http.post<any>(`${environment.base_url}/oauth/token`, body)
            .pipe(
                tap((tokens: Tokens) =>
                    this.storeTokens(tokens)
                )
            );
    }

    private doLoginUser(username: string, tokens: Tokens) {
        this.storeTokens(tokens);
    }

    private doLogoutUser() {
        this.removeTokens();
    }

    getJwtToken() {
        return localStorage.getItem(this.JWT_TOKEN);
    }

    private getRefreshToken() {
        return localStorage.getItem(this.REFRESH_TOKEN);
    }

    private storeJwtToken(jwt: string) {
        localStorage.setItem(this.JWT_TOKEN, jwt);
    }

    storeUser(user: any) {
        localStorage.setItem('user', JSON.stringify(user));
    }

    storeTokens(tokens: Tokens) {
        localStorage.setItem(this.JWT_TOKEN, tokens.access_token);
        localStorage.setItem(this.REFRESH_TOKEN, tokens.refresh_token);
    }

    removeTokens() {
        localStorage.removeItem(this.JWT_TOKEN);
        localStorage.removeItem(this.REFRESH_TOKEN);
    }
}
