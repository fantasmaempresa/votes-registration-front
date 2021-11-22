import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {FilterService} from "../../../../core/services/filter.service";
import {ActivatedRoute} from "@angular/router";
import {Observable, pluck, switchMap, tap} from "rxjs";
import {MatTableDataSource} from "@angular/material/table";

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

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  nextURL!: string;
  prevURL!: string;
  pageIndex = 1;

  @ViewChild(MatPaginator, {static: false}) paginator!: MatPaginator;
  dataSource$!: Observable<Object>;


  constructor(
    private filterService: FilterService,
    private route: ActivatedRoute,
  ) {
    if (this.route.snapshot.queryParams['party'] === MPLD) {
      this.dataSource$ = filterService.filterVoteFavor();
    } else if (this.route.snapshot.queryParams['party'] === ATTENDANCE) {
      this.dataSource$ = filterService.filterAttendanceFavor();
    } else {
      this.dataSource$ = filterService.filterNotVoteFavor();
    }

    this.dataSource$.subscribe(
      () => {
        this.dataSource.paginator = this.paginator;
      }
    );

    this.updateTable(this.dataSource$);

  }

  ngAfterViewInit() {
    let url = '';
    const paginator$ = this.paginator.page
      .pipe(
        tap(
          ({pageIndex, previousPageIndex}) => {
            if (previousPageIndex !== undefined && pageIndex > previousPageIndex) {
              url = this.nextURL;
            } else {
              url = this.prevURL;
            }
            this.isLoadingResults = true;
          }
        ),
        switchMap(() => this.filterService.changePage(url)));
    this.updateTable(paginator$);
  }

  private updateTable(observable$: Observable<any>) {
    observable$
      .pipe(
        pluck('data'),
        tap(
          () => {
            this.isLoadingResults = false;
          }
        ),
      )
      .subscribe((data: any) => {
        this.pageIndex = data.current_page - 1;
        this.prevURL = data.prev_page_url;
        this.nextURL = data.next_page_url;
        this.resultsLength = data.total;

        this.dataSource.data = data.data;

        this.resultsLength += 1;
        // fix to solve visual bug;
        setTimeout(
          () => {
            this.resultsLength -= 1;
          }
        );
      });
  }

}
