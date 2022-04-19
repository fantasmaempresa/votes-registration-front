import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {map} from "rxjs";
import {FileHandle} from "../../shared/directives/drop-files.directive";

@Injectable({
  providedIn: 'root'
})
export class TemplatesService {

  constructor(private http: HttpClient) {
  }

  fetchAll() {
    return this.http.get(`${environment.base_url}/templates`).pipe(
      map((data: any) => data.data)
    )
  }

  save(user: any) {
    return this.http.post(`${environment.base_url}/templates`, user).pipe(
      map((data: any) => data.data)
    )
  }

  update(user: any) {
    return this.http.put(`${environment.base_url}/templates/${user.id}`, user).pipe(
      map((data: any) => data.data)
    )
  }

  delete(id: number) {
    return this.http.delete(`${environment.base_url}/templates/${id}`);
  }

  uploadImage(files: FileHandle[], templateId: number) {
    const formData = new FormData();
    formData.append('image', files[0].file)
    const url = `${environment.base_url}/templates/upload/image/${templateId}`
    return this.http.post(url, formData)

  }
}
