import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class BasePersonalService {

  constructor(private http: HttpClient) {
  }

  createUser(id: number) {
    let url = `${environment.base_url}/createUser/${id}`;
    return this.http.post(url, {});
  }

  createReferred(id: number) {
    let url = `${environment.base_url}/referred/${id}`;
    return this.http.post(url, {});
  }

  deleteReferred(id: number) {
    let url = `${environment.base_url}/referred/${id}`;
    return this.http.delete(url);
  }

  getAllReferred() {
    let url = `${environment.base_url}/referred`;
    return this.http.get(url);
  }
}
