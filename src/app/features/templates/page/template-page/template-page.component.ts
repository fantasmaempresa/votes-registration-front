import { Component, OnInit } from '@angular/core';
import {map, Observable} from "rxjs";
import {TemplatesService} from "../../../../data/services/templates.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-template-page',
  templateUrl: './template-page.component.html',
  styleUrls: ['./template-page.component.scss']
})
export class TemplatePageComponent {
  constructor() {
  }

}
