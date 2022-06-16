import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {map} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CoalitionService {

  constructor(private http: HttpClient) { }

  countViewersDocs() {
    return this.http.get(`${environment.base_url}/coalition/countView`).pipe(
      map(({data}: any) => data)
    )
  }
}
