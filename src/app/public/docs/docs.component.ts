import {Component, Inject, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {DOCUMENT} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {AnnouncementComponent} from "./dialog/announcement/announcement.component";
import {CoalitionService} from "../../data/services/coalition.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.scss']
})
export class DocsComponent implements OnInit {
  pdfSrc = 'assets/docs/padron.pdf';
  views$!: Observable<any>
  // @ts-ignore
  favIcon: HTMLLinkElement = document.querySelector('#favIcon');
  constructor(private title:Title, @Inject(DOCUMENT) private _document: HTMLDocument, public dialog: MatDialog,
              private coalitionService: CoalitionService) {
    this.title.setTitle('Info');
    this.favIcon.href = './assets/icons/blank.ico'
    this.views$ = coalitionService.countViewersDocs();
  }

  ngOnInit(): void {
    this.openDialog()
  }

  openDialog() {
    const dialogRef = this.dialog.open(AnnouncementComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
