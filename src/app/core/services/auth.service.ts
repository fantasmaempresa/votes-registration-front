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
    let url = `${environment.base_url}/users/auth/requestToLogin`;
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
    let url = `${environment.base_url}/users/auth/authorize/${id}`
    return this.http.get(url);
  }

  unauthorizeLogin(id: number) {
    let url = `${environment.base_url}/users/auth/notAuthorize/${id}`;
    return this.http.get(url);
  }

  getDataUserLogged() {
    let url = `${environment.base_url}/users/auth/getDataLogged`
    return this.http.get(url).pipe(
      map((data: any) => data.data)
    );
  }

  logout() {
    this.removeTokens();
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

  getJwtToken() {
    return sessionStorage.getItem(this.JWT_TOKEN);
  }

  storeUser(user: any) {
    sessionStorage.setItem('user', JSON.stringify(user));
  }

  getUser() {
    return JSON.parse(sessionStorage.getItem('user') ?? '');
  }

  storeTokens(tokens: Tokens) {
    sessionStorage.setItem(this.JWT_TOKEN, tokens.access_token);
    sessionStorage.setItem(this.REFRESH_TOKEN, tokens.refresh_token);
  }

  removeTokens() {
    sessionStorage.removeItem(this.JWT_TOKEN);
    sessionStorage.removeItem(this.REFRESH_TOKEN);
  }

  private getRefreshToken() {
    return sessionStorage.getItem(this.REFRESH_TOKEN);
  }

  private storeJwtToken(jwt: string) {
    sessionStorage.setItem(this.JWT_TOKEN, jwt);
  }
}
