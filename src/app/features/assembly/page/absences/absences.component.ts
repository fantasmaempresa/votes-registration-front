import {AfterViewInit, ChangeDetectorRef, Component, OnInit, SecurityContext, ViewChild} from '@angular/core';
import {map, Observable} from "rxjs";
import {MatTableDataSource} from "@angular/material/table";
import {AssemblyService} from "../../../../core/services/assembly.service";
import {ActivatedRoute} from "@angular/router";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {AttendanceService} from "../../../../core/services/attendance.service";
import {FormControl} from "@angular/forms";
import {MatPaginator} from "@angular/material/paginator";
import {FilterService} from "../../../../core/services/filter.service";

@Component({
  selector: 'app-absences',
  templateUrl: './absences.component.html',
  styleUrls: ['./absences.component.scss']
})
export class AbsencesComponent implements OnInit, AfterViewInit {
  isLoadingResults = false;

  showResumeList = false;

  selectedAssembly: any = null;

  selectAssemblyLabel = 'Selección de asamblea';

  assemblies$!: Observable<any>;
  byDependencies$!: Observable<any>;

  dependencies$!: Observable<any>;

  displayedColumns: string[] = [
    "name",
    "last_name",
    "mother_last_name",
    "dependency",
    "affiliation_area",
    "expedient",
    "phone_number",
    "gender",
    "options"
  ];

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  totalItems = 0;

  pageSize = 10;

  dependencyFilter!: FormControl;

  constructor(private assemblyService: AssemblyService,
              private attendanceService: AttendanceService,
              private filterService: FilterService,
              private route: ActivatedRoute,
              private domSanitizer: DomSanitizer,
              private cdr: ChangeDetectorRef
              ) {
    this.dependencyFilter = new FormControl({});
    this.dependencies$ = this.filterService.fetchDependencies();
    this.dependencyFilter.valueChanges.subscribe(
      {
        next: (val) => {
          if(val) {
            this.dataSource.filter = val.dependency.trim().toLowerCase();
          } else {
            this.dataSource.filter = ''
          }
          // this.updateTable(this.filterService.filterByDependency(val));
        }
      }
    )

  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;

  }

  ngOnInit(): void {
    this.assemblies$ = this.assemblyService.fetchAll().pipe(map((resp: any) => resp.data));
  }

  fetchData(assembly: any) {
    this.isLoadingResults = true;
    this.assemblyService.fetchAbsences(assembly.id)
      .subscribe({
        next: ({data}: any) => {
          console.log(data);
          this.isLoadingResults = false;
          if (data) {
            // this.totalItems = data.total;
            this.dataSource = new MatTableDataSource<any>(data);
          this.cdr.detectChanges();
          this.dataSource.paginator = this.paginator
          }
        }
      })
  }

  downloadCSV() {
    let downloadResult: SafeResourceUrl;
    this.attendanceService.fetchCSV(this.selectedAssembly).subscribe(resp => {
      downloadResult = this.domSanitizer.bypassSecurityTrustResourceUrl(
        URL.createObjectURL(resp)
      );
      let sanitizedUrl = this.domSanitizer.sanitize(SecurityContext.RESOURCE_URL, downloadResult) as string;
      const element = document.createElement('a');
      element.href = sanitizedUrl;
      element.download = 'inasistencias.xlsx';
      document.body.appendChild(element);
      element.click();
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  selectAssembly(assembly: any) {
    this.selectedAssembly = assembly;
    this.selectAssemblyLabel = assembly.name;
    this.fetchData(assembly);
    this.byDependencies$ = this.attendanceService.filterByAttendance(this.selectedAssembly);
  }

  showResume() {
    this.showResumeList = true;
  }
}
