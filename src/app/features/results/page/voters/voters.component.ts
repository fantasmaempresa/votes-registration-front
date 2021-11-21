import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {FilterService} from "../../../../core/services/filter.service";
import {ActivatedRoute} from "@angular/router";
import {Observable, pluck, tap} from "rxjs";

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

  data = [];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  nextURL!: string;
  prevURL!: string;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  $sourceData!: Observable<Object>;


  constructor(private filterService: FilterService, private route: ActivatedRoute) {
    if (this.route.snapshot.queryParams['party'] === MPLD) {
      this.$sourceData = filterService.filterVoteFavor();
      console.log('Voto');
    } else if (this.route.snapshot.queryParams['party'] === ATTENDANCE){
      this.$sourceData = filterService.filterAttendanceFavor();
    }else{
      this.$sourceData = filterService.filterNotVoteFavor();
      console.log('NoVoto');
    }
    this.$sourceData
      .pipe(
        pluck('data'),
        tap(
          (data: any) => {
            this.nextURL = data.next_page_url;
            this.prevURL = data.prev_page_url;
            console.log(this.nextURL, this.prevURL);
          }
        ),
        pluck('data'),
        tap(
          (data: any) => {
            this.resultsLength = data.count;
            this.isLoadingResults = false;
          }
        ),
      )
      .subscribe((data: any) => (this.data = data));

  }

  ngAfterViewInit() {

    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    //
    // merge(this.sort.sortChange, this.paginator.page)
    //     .pipe(
    //         startWith({}),
    //         switchMap(() => {
    //           this.isLoadingResults = true;
    //           return this.exampleDatabase!.getRepoIssues(
    //               this.sort.active,
    //               this.sort.direction,
    //               this.paginator.pageIndex,
    //           ).pipe(catchError(() => observableOf(null)));
    //         }),
    //         map(data => {
    //           // Flip flag to show that loading has finished.
    //           this.isLoadingResults = false;
    //           this.isRateLimitReached = data === null;
    //
    //           if (data === null) {
    //             return [];
    //           }
    //
    //           // Only refresh the result length if there is new data. In case of rate
    //           // limit errors, we do not want to reset the paginator to zero, as that
    //           // would prevent users from re-triggering requests.
    //           this.resultsLength = data.total_count;
    //           return data.items;
    //         }),
    //     )
    //     .subscribe(data => (this.data = data));
  }

}
