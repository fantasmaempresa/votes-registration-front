import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {FilterService} from "../../../../core/services/filter.service";
import {ActivatedRoute} from "@angular/router";
import {merge, Observable, pluck, switchMap, tap} from "rxjs";

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
  pageIndex = 1;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  $sourceData!: Observable<Object>;


  constructor(private filterService: FilterService, private route: ActivatedRoute) {
    if (this.route.snapshot.queryParams['party'] === MPLD) {
      this.$sourceData = filterService.filterVoteFavor();
    } else if (this.route.snapshot.queryParams['party'] === ATTENDANCE){
      this.$sourceData = filterService.filterAttendanceFavor();
    }else{
      this.$sourceData = filterService.filterNotVoteFavor();
    }
    this.suscribeTable(this.$sourceData);

  }

  ngAfterViewInit() {

    // // If the user changes the sort order, reset back to the first page.
    // this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    //
    const $merge = merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        switchMap(([sort, paginator]: any) => {
          this.isLoadingResults = true;
          const url = this.nextURL;
          console.log(paginator);
          return this.filterService.changePage(url);
        }));
    this.suscribeTable($merge);
  }

  private suscribeTable($observable: Observable<any>) {
    $observable
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

}
