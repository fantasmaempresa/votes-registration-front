import {AfterViewInit, Component, SecurityContext, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {Observable, switchMap, tap} from "rxjs";
import {FilterService} from "../../../../core/services/filter.service";
import {ActivatedRoute} from "@angular/router";
import {FormControl} from "@angular/forms";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-assembly',
  templateUrl: './assembly.component.html',
  styleUrls: ['./assembly.component.scss']
})
export class AssemblyComponent implements AfterViewInit {

  displayedColumns: string[] = [
    "id_register",
    "last_name",
    "mother_last_name",
    "name",
    "dependency",
    "affiliation_area",
    "cve_job_level",
    "expedient",
    "phone_number",
    "gender"
  ];

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  nextURL!: string;
  prevURL!: string;
  pageIndex = 1;
  party!: string;

  dependencies$;

  dependencyFilter!: FormControl;

  @ViewChild(MatPaginator, {static: false}) paginator!: MatPaginator;
  dataSource$!: Observable<Object>;

  constructor(
      private filterService: FilterService,
      private route: ActivatedRoute,
      private domSanitizer: DomSanitizer
  ) {
    this.fetchData();
    this.dependencies$ = this.filterService.fetchDependencies();
    this.dependencyFilter = new FormControl({});
    this.dependencyFilter.valueChanges.subscribe(
        {
            next: (val) => {
                console.log(val)
                this.updateTable(this.filterService.filterByDependency(val));
            }
        }
    )
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

  fetchData() {
    this.dataSource$ = this.filterService.filterByDependency();
    this.dataSource$.subscribe(
        () => {
          this.dataSource.paginator = this.paginator;
        }
    );

    this.updateTable(this.dataSource$);
  }

  downloadCSV() {
      let downloadResult: SafeResourceUrl;
      this.filterService.fetchCSV(this.dependencyFilter.value).subscribe(resp => {
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

  private updateTable(observable$: Observable<any>) {
    observable$
        .pipe(
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
