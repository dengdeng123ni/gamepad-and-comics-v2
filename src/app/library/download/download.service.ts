// @ts-nocheck
import { Injectable } from '@angular/core';
import { PdfService } from './pdf.service';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { PptService } from './ppt.service';
import { ZipService } from './zip.service';
import { EpubService } from './epub.service';
@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  constructor(
    public pdfService: PdfService,
    public pptService: PptService,
    public zipService: ZipService,
    public epubService: EpubService
  ) { }
  async pdf({ name, images = [''], pageOrder = false, isFirstPageCover = false, page }) {
    const blob = await this.pdfService.createPdf(images, { pageOrder, isFirstPageCover, page })
    const srcs = blob.type.split("/");
    const path = `${name}.${srcs.at(-1)}`;
    saveAs(blob, path);
  }
  async ppt({ name, images = [''], pageOrder = false, isFirstPageCover = false, page }) {
    const blob = await this.pptService.createPpt(images, { pageOrder, isFirstPageCover, page })
    const path = `${name}.pptx`;
    saveAs(blob, path);
  }
  async zip({ name, images = [''], pageOrder = false, isFirstPageCover = false, page }) {
    let arr = [];
    const blobs = await this.zipService.createZip(images, { pageOrder, isFirstPageCover, page })
    blobs.forEach((blob, index) => {
      arr.push({ path: `${index + 1}`, blob: blob })
    })
    if (!arr.length) return

    var zip = new JSZip();
    arr.forEach(x => {
      const srcs = x.blob.type.split("/");
      let path = `${x.path}.${srcs.at(-1)}`;
      zip.file(path, x.blob)
    })
    zip.generateAsync({ type: "blob" }).then(function (content) {
      saveAs(content, `${name}`);
    })
  }
  async epub({ name, images = [''], pageOrder = false, isFirstPageCover = false, page }) {
    const blob = await this.epubService.createEpub(images, { pageOrder, isFirstPageCover, page })
    saveAs(blob, `${name}.epub`);
    return

  }
}
