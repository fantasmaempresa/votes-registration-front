import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {map, pluck} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BasePersonalService {

  constructor(private http: HttpClient) {
  }

  createUser(id: number) {
    let url = `${environment.base_url}/basePersonals/operation/createUser/${id}`;
    return this.http.post(url, {}).pipe(pluck('data'));
  }

  save(baseStaff: any) {
    let url = `${environment.base_url}/basePersonals`;
    return this.http.post(url, baseStaff ).pipe(map((data:any) => data.data));
  }

  updateBasePersonal(staff: any) {
    let url = `${environment.base_url}/basePersonals/${staff.id}`;
    return this.http.put(url, staff);
  }

  createReferred(id: number) {
    let url = `${environment.base_url}/basePersonals/operation/referred/${id}`;
    return this.http.post(url, {});
  }

  deleteReferred(id: number) {
    let url = `${environment.base_url}/basePersonals/operation/referred/${id}`;
    return this.http.delete(url);
  }

  getAllReferred() {
    let url = `${environment.base_url}/basePersonals/operation/referred`;
    return this.http.get(url);
  }

  registerInTemplate(baseId: number, templateId: number) {
    const url = `${environment.base_url}/basePersonals/vote/basePersonal/${baseId}/template/${templateId}`;
    return this.http.get(url);
  }

  removeFromTemplate(baseId: number) {
    const url = `${environment.base_url}/basePersonals/vote/remove/basePersonal/${baseId}`;
    return this.http.get(url);
  }



  // voteFavor(id:number) {
  //   let url = `${environment.base_url}/basePersonals/vote/laborUnion/${id}`
  //   return this.http.get(url);
  // }
  //
  // voteNoFavor(id: number) {
  //   let url = `${environment.base_url}/basePersonals/vote/noLaborUnion/${id}`
  //   return this.http.get(url);
  // }
  //
  // voteAttendance(id: number) {
  //   let url = `${environment.base_url}/basePersonals/vote/attendanceLaborUnion/${id}`
  //   return this.http.get(url);
  // }
}
