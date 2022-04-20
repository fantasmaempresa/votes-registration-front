import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {FilterService} from "../../../../core/services/filter.service";
import {ActivatedRoute} from "@angular/router";
import {map, Observable, pluck, switchMap, tap} from "rxjs";
import {MatTableDataSource} from "@angular/material/table";
import {ResultsService} from "../../../../core/services/results.service";
import {MatSort} from "@angular/material/sort";

const MPLD = 'mpld';
const ATTENDANCE = 'attendance';


@Component({
  selector: 'app-voters',
  templateUrl: './voters.component.html',
  styleUrls: ['./voters.component.scss']
})
export class VotersComponent implements AfterViewInit {

  displayedColumns: string[] = [
    "id_register",
    "last_name",
    "mother_last_name",
    "name",
    "dependency",
    "affiliation_area",
    "cve_job_level",
    "denomination_jod",
    "denomination_jod_description",
    "gender"
  ];

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();

  isLoadingResults = true;
  party!: string;
  partyName = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource$!: Observable<Object>;



  constructor(
    private filterService: FilterService,
    private route: ActivatedRoute,
    private resultsService: ResultsService
  ) {
    this.party = this.route.snapshot.queryParams['party'];
    this.resultsService.fetch().pipe(
      map((result: any[]) => result.filter(x => x.id === +this.party)),
      map((result: any) => {
        this.partyName = result[0].name;
        return result[0].base_personal
      })
    ).subscribe({
      next: (value) => {
        this.dataSource = new MatTableDataSource(value);
        this.isLoadingResults = false
      }
    })
    ;
    // this.dataSource$.subscribe({
    //   next: value => {
    //     console.log(value)
    //   }
    // })
    // if (this.route.snapshot.queryParams['party'] === MPLD) {
    //   this.party = 'Movimiento por la democracia';
    //   this.dataSource$ = filterService.filterVoteFavor();
    // } else if (this.route.snapshot.queryParams['party'] === ATTENDANCE) {
    //   this.party = 'Asistencia';
    //   this.dataSource$ = filterService.filterAttendanceFavor();
    // } else {
    //   this.party = 'Otro';
    //   this.dataSource$ = filterService.filterNotVoteFavor();
    // }

    // this.updateTable(this.dataSource$);

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // private updateTable(observable$: Observable<any>) {
  //   observable$
  //     .pipe(
  //       pluck('data'),
  //       tap(
  //         () => {
  //           this.isLoadingResults = false;
  //         }
  //       ),
  //     )
  //     .subscribe((data: any) => {
  //       this.pageIndex = data.current_page - 1;
  //       this.prevURL = data.prev_page_url;
  //       this.nextURL = data.next_page_url;
  //       this.resultsLength = data.total;
  //
  //       this.dataSource.data = data.data;
  //
  //       this.resultsLength += 1;
  //       // fix to solve visual bug;
  //       setTimeout(
  //         () => {
  //           this.resultsLength -= 1;
  //         }
  //       );
  //     });
  // }

}
