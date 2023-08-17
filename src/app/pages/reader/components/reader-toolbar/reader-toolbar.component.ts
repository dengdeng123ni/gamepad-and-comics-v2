import { Component, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { DataService } from '../../services/data.service';
import { CurrentService } from '../../services/current.service';
import { DoublePageThumbnailService } from '../double-page-thumbnail/double-page-thumbnail.service';
import { ChaptersThumbnailService } from '../chapters-thumbnail/chapters-thumbnail.service';

@Component({
  selector: 'app-reader-toolbar',
  templateUrl: './reader-toolbar.component.html',
  styleUrls: ['./reader-toolbar.component.scss']
})
export class ReaderToolbarComponent {
  isfullscreen = !!document.fullscreenElement;
  isMobile = (navigator as any).userAgentData.mobile;

  isFirstPageCover = true;

  @ViewChild(MatMenuTrigger) menu: MatMenuTrigger | any;
  constructor(
    public current: CurrentService,
    public data: DataService,
    public doublePageThumbnail:DoublePageThumbnailService,
    public chaptersThumbnail:ChaptersThumbnailService
  ) {

  }
  menuObj: {
    list: any,
    type: string
  } = {
      list: [],
      type: "delete"
    }
  back() {
    window.history.back()
  }
  firstPageCoverChange() {

  }

  imageRotation() {

  }
  separatePage() {

  }
  mergePage() {

  }
  insertPage() {

  }
  openDeleteMenu($event: MouseEvent) {

  }
  closeMenu() {
    if (this.menuObj.type == "list") {
      const node_reader_toolbar: any = document.querySelector("#reader_toolbar_section")
      setTimeout(() => {
        node_reader_toolbar.style.opacity = 0;
      }, 0)
    } else if (this.menuObj.type == "delete") {
      const node_reader_toolbar: any = document.querySelector("#reader_toolbar_page")
      setTimeout(() => {
        node_reader_toolbar.style.opacity = 0;
      }, 0)
    }

  }
  openList($event: MouseEvent) {
    this.menuObj.type = "list"
    const node_reader_toolbar: any = document.querySelector("#reader_toolbar_section")
    node_reader_toolbar.style.opacity = 1;
    this.menuObj.list = [];
    this.menuObj.list = this.data.chapters;
    const p = ($event.target as any).getBoundingClientRect();
    let node = (document.getElementById(`reader_toolbar_menu`) as any);
    node.style.top = `${this.menuObj.list.length < 3 ? p.top : p.bottom}px`;
    node.style.left = `${p.x + p.width + 4}px`;
    console.log(this.menuObj.list);

    setTimeout(() => this.menu.openMenu(), 0)

  }
  onItem(id: string) {
      this.current._chapterChange(id);
  }
  togglePage() {

  }
  previous() {
    this.current._chapterPrevious();
  }
  next() {
    this.current._chapterNext();
  }

  isFullChange() {
    this.isfullscreen = !this.isfullscreen
    if (document.fullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    } else {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      }
    }
  }
}
