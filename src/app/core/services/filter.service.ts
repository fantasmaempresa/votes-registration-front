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
    let url = `${environment.base_url}/basePersonals/filter/voteLaborUnion`;
    return this.http.get(url);
  }

  filterNotVoteFavor() {
    let url = `${environment.base_url}/basePersonals/filter/noVoteLaborUnion`;
    return this.http.get(url);
  }

  filterAttendanceFavor() {
    let url = `${environment.base_url}/basePersonals/filter/total/attendanceVote`;
    return this.http.get(url);
  }

  filterByDependency(dependency = {}) {
    let url = `${environment.base_url}/basePersonals/filter/asDependency`;
    return this.http.post(url, dependency).pipe(
        map((resp: any) => resp.data)
    );
  }

  fetchDependencies() {
    let url = `${environment.base_url}/basePersonals/filter/dependencies`;
    return this.http.get(url).pipe(
        map((resp: any) => resp.data)
    );
  }

  fetchCSV(filter: {}) {
    let url = `${environment.base_url}/basePersonals/filter/dependencyCSV`;
    return this.http.post(url, filter, {responseType: 'blob'}).pipe(
        map((res: any) => {
          return new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        })
    );
  }

  changePage(url: string) {
    return this.http.get(url);
  }
}
