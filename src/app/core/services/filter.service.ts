import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {map} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor(private http: HttpClient) {
  }

  filterVoteFavor() {
    let url = `${environment.base_url}/filterVoteLaborUnion`;
    return this.http.get(url);
  }

  filterNotVoteFavor() {
    let url = `${environment.base_url}/filterNoVoteLaborUnion`;
    return this.http.get(url);
  }

  filterAttendanceFavor() {
    let url = `${environment.base_url}/filterAttendanceVote`;
    return this.http.get(url);
  }

  filterByDependency(dependency = {}) {
    let url = `${environment.base_url}/filterAsDependency`;
    return this.http.post(url, dependency).pipe(
        map((resp: any) => resp.data)
    );
  }

  fetchDependencies() {
    let url = `${environment.base_url}/filterDependencies`;
    return this.http.get(url).pipe(
        map((resp: any) => resp.data)
    );
  }

  fetchCSV(filter: {}) {
    let url = `${environment.base_url}/filterDependencyCSV`;
    return this.http.post(url, filter, {responseType: 'blob'}).pipe(
        map((res: any) => {
          return new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        })
    );;
  }

  changePage(url: string) {
    return this.http.get(url);
  }
}
