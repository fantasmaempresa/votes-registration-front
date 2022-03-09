import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {map} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AssemblyService {

  constructor(private http: HttpClient) { }

  save(assembly: any) {
    return this.http.post(`${environment.base_url}/assemblies`, assembly)
  }

  fetchAll() {
    return this.http.get(`${environment.base_url}/assemblies`).pipe(map((resp: any) => resp.data))
  }

  fetch(id: number) {
    return this.http.get(`${environment.base_url}/assemblies/${id}`)
  }

  update(assembly: any) {
    return this.http.put(`${environment.base_url}/assemblies/${assembly.id}`, assembly)
  }

  delete(id: number) {
    return this.http.delete(`${environment.base_url}/assemblies/${id}`)
  }
}