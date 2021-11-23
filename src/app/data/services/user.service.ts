import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {map, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  fetchAll() {
    return this.http.get(`${environment.base_url}/api/users`).pipe(
        map((data: any) => data.data)
    )
  }

  delete(id: number) {
    return this.http.delete(`${environment.base_url}/api/users`);
  }
}

