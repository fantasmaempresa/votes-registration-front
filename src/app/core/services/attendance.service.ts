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

  passAttendance(id: number, number_list: string) {
    let url = `${environment.base_url}/basePersonals/${id}`;
    return this.http.put(url, {number_list});
  }

  filterByAttendance() {
    let url = `${environment.base_url}/filterByNumberList`;
    return this.http.get(url).pipe(pluck('data'));
  }

  totalAttendance() {
    let url = `${environment.base_url}/totalNumberList`;
    return this.http.get(url);
  }

  generateRandomNumber() {
    return random(10, {letters: false}).toString();
  }
}
