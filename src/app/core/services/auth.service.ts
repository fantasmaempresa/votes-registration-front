import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public http: HttpClient) { }

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
}
