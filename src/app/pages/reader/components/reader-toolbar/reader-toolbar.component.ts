import { Component, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { DataService } from '../../services/data.service';
import { CurrentService } from '../../services/current.service';

@Component({
  selector: 'app-reader-toolbar',
  templateUrl: './reader-toolbar.component.html',
  styleUrls: ['./reader-toolbar.component.scss']
})
export class ReaderToolbarComponent {
  isfullscreen = !!document.fullscreenElement;
  isMobile = (navigator as any).userAgentData.mobile;

  @ViewChild(MatMenuTrigger) menu: MatMenuTrigger | any;
  constructor(
    public current: CurrentService,
    public data: DataService
  ) {

  }
  menuObj = {
    list: [],
    type: "delete"
  }
  back() {
    window.history.back()
  }
}
