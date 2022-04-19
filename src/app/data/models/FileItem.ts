import {DomSanitizer, SafeUrl} from "@angular/platform-browser";

export class FileItem {

  public file: File;
  public fileName: string;
  public url: string | null;
  public isUploading: boolean;
  public progress: number;
  public ext: string | undefined

  constructor(archivo: File, url: string | null, ext?: string,) {

    this.file = archivo;
    this.fileName = archivo.name;
    this.ext = ext

    this.isUploading = false;
    this.progress = 0;
    this.url = url

  }

}
