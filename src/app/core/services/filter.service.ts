import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor(private http: HttpClient) {
  }

  filterVoteFavor() {
    let url = `${environment.base_url}/api/filterVoteLaborUnion`;
    return this.http.get(url);
  }

  filterNotVoteFavor() {
    let url = `${environment.base_url}/api/filterNoVoteLaborUnion`;
    return this.http.get(url);
  }

  filterAttendanceFavor() {
    let url = `${environment.base_url}/api/filterAttendanceVote`;
    return this.http.get(url);
  }

  changePage(url: string) {
    return this.http.get(url);
  }
}
