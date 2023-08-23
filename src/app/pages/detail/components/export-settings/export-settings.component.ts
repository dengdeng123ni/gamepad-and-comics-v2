import { Component } from '@angular/core';
import { ExportSettingsService } from './export-settings.service';
import { DataService } from '../../services/data.service';
import { DbControllerService, DownloadService, I18nService } from 'src/app/library/public-api';
import { LoadingService } from '../loading/loading.service';

@Component({
  selector: 'app-export-settings',
  templateUrl: './export-settings.component.html',
  styleUrls: ['./export-settings.component.scss']
})
export class ExportSettingsComponent {
  constructor(
    public exportSettings: ExportSettingsService,
    public DbController: DbControllerService,
    public download: DownloadService,
    public data: DataService,
    public loading:LoadingService,
    public i18n: I18nService
  ) {
    this.pageOrder = this.data.comics_config.is_page_order;
    this.isFirstPageCover = this.data.comics_config.is_first_page_cover;
  }
  pageOrder = false;
  isFirstPageCover = false;
  page = "double"; //  double one
  type = "PDF";
  change(e: string) {
    this.page = e;
  }
  onEpub() {
    const node: any = document.querySelector("#page_double");
    node.querySelector("button").click();
  }
  async on() {
    this.loading.open();
    const chapters = this.data.chapters.filter(x => x.selected);
    if(chapters.length==0) return
    if (this.type == "PDF") {
      for (let index = 0; index < chapters.length; index++) {
        const x = chapters[index]
        const pages = await this.DbController.getPages(x.id);
        await this.download.pdf({ name: `${this.data.comics_info.title}_${x.title}`.replace("\"", "").replace(/\s*/g, ''), images: pages.map((x: { src: any; }) => x.src), pageOrder: this.pageOrder, isFirstPageCover: this.isFirstPageCover, page: this.page })
      }
    }
    if (this.type == "PPT") {
      for (let index = 0; index < chapters.length; index++) {
        const x = chapters[index]
        const pages = await this.DbController.getPages(x.id);
        await this.download.ppt({ name: `${this.data.comics_info.title}_${x.title}`.replace("\"", "").replace(/\s*/g, ''), images: pages.map((x: { src: any; }) => x.src), pageOrder: this.pageOrder, isFirstPageCover: this.isFirstPageCover, page: this.page })
      }
    }
    if (this.type == "ZIP") {
      for (let index = 0; index < chapters.length; index++) {
        const x = chapters[index]
        const pages = await this.DbController.getPages(x.id);
        await this.download.zip({ name: `${this.data.comics_info.title}_${x.title}`.replace("\"", "").replace(/\s*/g, ''), images: pages.map((x: { src: any; }) => x.src), pageOrder: this.pageOrder, isFirstPageCover: this.isFirstPageCover, page: this.page })
      }
    }
    if (this.type == "EPUB") {
      for (let index = 0; index < chapters.length; index++) {
        const x = chapters[index]
        const pages = await this.DbController.getPages(x.id);
        await this.download.epub({ name: `${this.data.comics_info.title}_${x.title}`.replace("\"", "").replace(/\s*/g, ''), images: pages.map((x: { src: any; }) => x.src), pageOrder: this.pageOrder, isFirstPageCover: this.isFirstPageCover, page: this.page })
      }
    }
    this.loading.close();
  }
}
