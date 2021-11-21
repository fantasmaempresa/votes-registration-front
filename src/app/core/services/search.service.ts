import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private http: HttpClient) { }

  search(query: string) {
    let url = `${environment.base_url}/api/searchPerson`;
    let body = {
      search: query
    }
    return this.http.post(url, body);
  }
}
