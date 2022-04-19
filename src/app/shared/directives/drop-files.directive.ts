import {Directive, EventEmitter, HostBinding, HostListener, Input, Output} from '@angular/core';
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";

export interface FileHandle{
  file: File;
  url: SafeUrl
}
@Directive({
  selector: '[appDropFiles]'
})
export class DropFilesDirective {
  @Output('files') files: EventEmitter < FileHandle[] > = new EventEmitter();
  @Input('multiple') multiple: boolean = false;
  @HostBinding('style.background') public background = '#eee';

  constructor(private sanitizer: DomSanitizer) {}

  @HostListener('dragover', ['$event']) public onDragOver(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#999';
  }
  @HostListener('dragleave', ['$event']) public onDragLeave(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#eee';
  }
  @HostListener('drop', ['$event']) public onDrop(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#eee';
    let files: FileHandle[] = [];
    if(!evt.dataTransfer) {
      return;
    }
    if(evt.dataTransfer.files.length > 1) {
      return;
    }
    for (let i = 0; i < evt.dataTransfer.files.length; i++) {
      const file = evt.dataTransfer.files[i];
      const url = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));
      files.push({
        file,
        url
      });
    }
    if (files.length > 0) {
      this.files.emit(files);
    }
  }
}
