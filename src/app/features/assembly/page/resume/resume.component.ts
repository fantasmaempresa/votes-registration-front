import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {ResultsService} from "../../../../core/services/results.service";

@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.scss']
})
export class ResumeComponent implements OnInit {
  byDependency$!: Observable<any>;

  constructor(private resultsService: ResultsService) { }

  ngOnInit(): void {
    this.byDependency$ = this.resultsService.getByDependencies();
  }

}
