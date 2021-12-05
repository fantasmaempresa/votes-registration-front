import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {map} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ReferredService {

  constructor(private http: HttpClient) {
  }

  fetchAll() {
    return this.http.get(`${environment.base_url}/referred`).pipe(
      map((data: any) => data.data)
    )
  }

  create(id: number) {
    return this.http.post(`${environment.base_url}/referred/${id}`, {}).pipe(
      map((data: any) => data.data)
    )
  }

  delete(id: number) {
    return this.http.delete(`${environment.base_url}/api/referred`);
  }
}

