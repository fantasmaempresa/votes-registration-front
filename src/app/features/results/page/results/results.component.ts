import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Observable} from "rxjs";
import {ResultsService} from "../../../../core/services/results.service";

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {

  totalFavor$!: Observable<any>;
  totalNoFavor$!: Observable<any>;
  attendance$!: Observable<any>

  isLoadingResults = true;

  constructor(private router: Router, private route: ActivatedRoute,
              private resultsService: ResultsService) {
  }

  ngOnInit(): void {
    this.totalFavor$ = this.resultsService.getTotalFavor();
    this.totalNoFavor$ = this.resultsService.getTotalNoFavor();
    this.attendance$ = this.resultsService.getTotalAttendance();
  }

  goToVoters(party: string) {
    this.router.navigate(['voters'], {relativeTo: this.route.parent, queryParams: {party}},)
  }

}
