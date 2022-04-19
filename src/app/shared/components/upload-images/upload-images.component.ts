import {Component, EventEmitter, OnInit, Output, SecurityContext, ViewChild} from '@angular/core';
import {FileItem} from "../../../data/models/FileItem";
import {FormControl} from "@angular/forms";
import {MatSelectionList} from "@angular/material/list";
import {DomSanitizer} from "@angular/platform-browser";
import {FileHandle} from "../../directives/drop-files.directive";

@Component({
  selector: 'app-upload-images',
  templateUrl: './upload-images.component.html',
  styleUrls: ['./upload-images.component.scss']
})
export class UploadImagesComponent implements OnInit {
  @Output('files') files: EventEmitter<FileHandle[]> = new EventEmitter();

  uploadedFiles: FileHandle[] = [];

  fileControl: FormControl = new FormControl();

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
  }

  onFileChange(files: any) {
    this.uploadedFiles = [];
    const selectedFiles = files.target.files
    for (const file of selectedFiles) {
      const url = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));
      this.uploadedFiles.push({
        file,
        url
      })
    }
    this.files.emit(this.uploadedFiles)
  }

  filesDropped(files: FileHandle[]) {
    this.uploadedFiles = files;
    this.files.emit(this.uploadedFiles)
  }

  clear() {
    this.uploadedFiles = [];
    this.files.emit(this.uploadedFiles)
  }

}
