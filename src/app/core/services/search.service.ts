import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {map} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class SearchService {

    constructor(private http: HttpClient) {
    }

    search(query: string) {
        let url = `${environment.base_url}/api/searchPerson`;
        let body = {
            search: query
        }
        return this.http.post(url, body)
            .pipe(
                map((res: any) => res.data),
                map((res: any) => {
                    return res.map((x: any) => {
                        x.denomination_jod_description = x.denomination_jod_description.replace(/\\/g, '');
                        return x;
                    })
                })
            );
    }

    voteFavor(id:number) {
        let url = `${environment.base_url}/api/voteLaborUnion/${id}`
        return this.http.get(url);
    }

    voteNoFavor(id: number) {
        let url = `${environment.base_url}/api/noVoteLaborUnion/${id}`
        return this.http.get(url);
    }

    voteAttendance(id: number) {
        let url = `${environment.base_url}/api/attendanceVoteLaborUnion/${id}`
        return this.http.get(url);
    }
}
