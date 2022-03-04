import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {map} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  fetchAll() {
    return this.http.get(`${environment.base_url}/users`).pipe(
      map((data: any) => data.data)
    )
  }

  save(user: any) {
    return this.http.post(`${environment.base_url}/users`, user).pipe(
      map((data: any) => data.data)
    )
  }

  update(user: any) {
    return this.http.put(`${environment.base_url}/users/${user.id}`, user).pipe(
      map((data: any) => data.data)
    )
  }

  delete(id: number) {
    return this.http.delete(`${environment.base_url}/users/${id}`);
  }
}

