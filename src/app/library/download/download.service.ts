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
  async pdf({ name, images = [''], pageOrder = false, isFirstPageCover = false, page }): Promise<Blob> {
    const blob = await this.pdfService.createPdf(images, { pageOrder, isFirstPageCover, page })
    return blob
  }
  async ppt({ name, images = [''], pageOrder = false, isFirstPageCover = false, page }): Promise<Blob> {
    const blob = await this.pptService.createPpt(images, { pageOrder, isFirstPageCover, page })
    return blob
  }
  async zip({ name, images = [''], pageOrder = false, isFirstPageCover = false, page }): Promise<Array<Blob>> {
    const blobs = await this.zipService.createZip(images, { pageOrder, isFirstPageCover, page })
    return blobs
  }
  async epub({ name, images = [''], pageOrder = false, isFirstPageCover = false, page }): Promise<Blob> {
    const blob = await this.epubService.createEpub(images, { pageOrder, isFirstPageCover, page })

    return blob

  }

  async ImageToTypeBlob({ type, name, images = [''], pageOrder = false, isFirstPageCover = false, page }) {
    if (type == "PDF") return await this.pdf({ name, images, pageOrder, isFirstPageCover, page })
    if (type == "PPT") return await this.ppt({ name, images, pageOrder, isFirstPageCover, page })
    if (type == "ZIP") return await this.zip({ name, images, pageOrder, isFirstPageCover, page })
    if (type == "EPUB") return await this.epub({ name, images, pageOrder, isFirstPageCover, page })
  }
  async download({ type, name, images = [''], pageOrder = false, isFirstPageCover = false, page }) {
    if (type == "PDF") {
      const blob=await this.pdf({ name, images, pageOrder, isFirstPageCover, page })
      const srcs = blob.type.split("/");
      const path = `${name}.${srcs.at(-1)}`;
      saveAs(blob, path);
    }
    if (type == "PPT") {
      const blob= await this.ppt({ name, images, pageOrder, isFirstPageCover, page })
      const path = `${name}.pptx`;
      saveAs(blob, path);
    }
    if (type == "ZIP") {
      const blobs = await this.zip({ name, images, pageOrder, isFirstPageCover, page })
      let arr = [];
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
    if (type == "EPUB") {
      const blob= await this.epub({ name, images, pageOrder, isFirstPageCover, page })
      saveAs(blob, `${name}.epub`);
    }
  }

}
