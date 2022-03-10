import {Component, OnInit} from '@angular/core';
import {map, Observable} from "rxjs";
import {AssemblyService} from "../../../../core/services/assembly.service";

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit {

  selectedAssembly: any = null;
  selectAssemblyLabel = 'Selección de asamblea'

  assemblies$!: Observable<any>;

  constructor(private assemblyService: AssemblyService) { }

  ngOnInit() {
    this.assemblies$ = this.assemblyService.fetchAll().pipe(map((resp: any) => resp.data));
  }

  selectAssembly(assembly: any) {
    this.selectedAssembly = assembly;
    this.selectAssemblyLabel = assembly.name;
  }

}
