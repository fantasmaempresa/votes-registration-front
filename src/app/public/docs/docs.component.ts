import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.scss']
})
export class DocsComponent implements OnInit {
  pdfSrc = 'assets/docs/sample.pdf';
  constructor() { }

  ngOnInit(): void {
  }

}
