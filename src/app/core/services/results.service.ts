import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {map} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ResultsService {

    constructor(private http: HttpClient) {
    }

    getTotalFavor() {
        return this.http.get(`${environment.base_url}/basePersonals/filter/total/voteLaborUnion`)
            .pipe(
                map((res: any) => res.data)
            )
    }

    getTotalNoFavor() {
        return this.http.get(`${environment.base_url}/basePersonals/filter/total/noVoteLaborUnion`)
            .pipe(
                map((res: any) => res.data),
            )
    }

    getTotalAttendance() {
        return this.http.get(`${environment.base_url}/basePersonals/filter/total/attendanceVote`)
            .pipe(
                map((res: any) => res.data),
            )
    }

    getByDependencies() {
        return this.http.get(`${environment.base_url}/basePersonals/filter/countByDependency`)
            .pipe(
                map((res: any) => res.data)
            )
    }
}
