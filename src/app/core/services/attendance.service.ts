import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import random from "string-random";
import {map, pluck} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  constructor(private http: HttpClient) {
  }

  passAttendance(assembly: any, baseStaff: any) {
    let url = `${environment.base_url}/assemblies/operations/rollCall/assembly/${assembly.id}/basePersonal/${baseStaff.id}`
    return this.http.get(url);
  }

  removeAttendance(assembly: any, baseStaff: any) {
    return this.http.get(`${environment.base_url}/assemblies/operations/deleteRollCall/assembly/${assembly.id}/basePersonal/${baseStaff.id}`)
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

  fetchCSV(assembly: any) {
    let url = `${environment.base_url}/assemblies/export/assemblyAssistance/${assembly.id}`;
    return this.http.get(url, {responseType: 'blob'}).pipe(
      map((res: any) => {
        return new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      })
    );
    // return this.http.post(url, filter, {responseType: 'blob'}).pipe(
    //   map((res: any) => {
    //     return new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    //   })
    // );
  }
}
