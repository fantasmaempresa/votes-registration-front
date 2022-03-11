import {Component, OnInit, SecurityContext, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {FormControl} from "@angular/forms";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {map, Observable, Subscription} from "rxjs";
import {FilterService} from "../../../../core/services/filter.service";
import {ActivatedRoute} from "@angular/router";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {AssemblyService} from "../../../../core/services/assembly.service";
import {AttendanceService} from "../../../../core/services/attendance.service";
import Swal from "sweetalert2";
import {PrinterService} from "../../../../core/services/printer.service";

@Component({
  selector: 'app-signatures',
  templateUrl: './signatures.component.html',
  styleUrls: ['./signatures.component.scss']
})
export class SignaturesComponent implements OnInit {
  showResumeList = false;
  @ViewChild(MatPaginator, {static: false}) paginator!: MatPaginator;

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

  totalItems = 0;
  pageSize = 10;
  pageEvent!: PageEvent;

  isLoadingResults = false;
  // nextURL!: string;
  // prevURL!: string;
  // pageIndex = 1;
  party!: string;

  dependencies$;

  dependencyFilter!: FormControl;

  assemblies$!: Observable<any>;

  assistanceSubscription!: Subscription;

  selectedAssembly: any = null;
  selectAssemblyLabel = 'Selección de asamblea'
  byDependencies$!: Observable<any>;

  constructor(
      private filterService: FilterService,
      private route: ActivatedRoute,
      private domSanitizer: DomSanitizer,
      private assemblyService: AssemblyService,
      private attendanceService: AttendanceService,
      private printerService: PrinterService
  ) {
    this.dependencies$ = this.filterService.fetchDependencies();
    this.dependencyFilter = new FormControl({});
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

  ngOnInit() {
    this.assemblies$ = this.assemblyService.fetchAll().pipe(map((resp: any) => resp.data));
  }

  fetchData(assembly: any) {
    this.isLoadingResults = true;
    this.assemblyService.fetch(assembly.id)
      .pipe(
        map(({base_personal}: any) => base_personal)
      )
      .subscribe({
      next: (data: any) => {
        this.isLoadingResults = false;
        if (data) {
          // this.totalItems = data.total;
          this.dataSource = new MatTableDataSource<any>(data);
        }
      }
    })
  }

  selectAssembly(assembly: any) {
    this.selectedAssembly = assembly;
    this.selectAssemblyLabel = assembly.name;
    this.fetchData(assembly);
    this.byDependencies$ = this.attendanceService.filterByAttendance(this.selectedAssembly);
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
      element.download = 'asamblea.xlsx';
      document.body.appendChild(element);
      element.click();
    })
  }

  printTicket(person: any) {
    const randNumber = this.attendanceService.generateRandomNumber();
    this.printerService.printAttendanceTicket(person, randNumber).then(r => {
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  removeRollCall(assembly: any, staff: any) {
    Swal.fire({
      title: `¿Esta seguro de quitar la asistencia de ${staff.name} ${staff.mother_last_name} ${staff.last_name}?`,
      showDenyButton: true,
      // showCancelButton: true,
      icon: 'warning',
      denyButtonText: `Cancelar`,
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#00d203',
      reverseButtons: false
    }).then((result) => {
      console.log(result);
      if(result.isConfirmed) {
        this.attendanceService.removeAttendance(assembly, staff).subscribe({
          next: async (resp) => {
            await Swal.fire('Asistencia removida', `Se ha removida la asistencia a ${staff.name} ${staff.mother_last_name} ${staff.last_name}`, 'success');
            this.fetchData(this.selectedAssembly);
          }
        })
      }
    });
  }

  showResume() {
    this.showResumeList = true;
  }

}
