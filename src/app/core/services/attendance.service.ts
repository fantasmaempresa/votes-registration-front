import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import random from "string-random";
import {pluck} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  constructor(private http: HttpClient) {
  }

  passAttendance(assembly: any, baseStaff: any) {
    let url = `${environment.base_url}/assemblies/operations/rollCall/assembly/${assembly.id}/basePersonal/${baseStaff.id}`
    return this.http.get(url);
    // let url = `${environment.base_url}/basePersonals/${id}`;
    // return this.http.put(url, {number_list});
  }

  filterByAttendance(assembly: any, dependency = '') {
    let url = `${environment.base_url}/assemblies/filter/assistanceByDependency/${assembly.id}`;
    let body = {
      dependency
    }
    return this.http.post(url, body).pipe(pluck('data'));
  }

  totalAttendance() {
    let url = `${environment.base_url}/totalNumberList`;
    return this.http.get(url);
  }

  generateRandomNumber() {
    return random(10, {letters: false}).toString();
  }
}
