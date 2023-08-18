import { Injectable } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { OnePageThumbnailMode1Component } from './one-page-thumbnail-mode1.component';
interface DialogData {
  chapter_id: number;
  page_index: number
}

@Injectable({
  providedIn: 'root'
})
export class OnePageThumbnailMode1Service {

  constructor(private _sheet: MatBottomSheet,) { }

  opened: boolean = false;
  open(data?:DialogData) {
    if (this.opened == false) {
      if (this.opened == false) {
        const sheetRef = this._sheet.open(OnePageThumbnailMode1Component, { backdropClass: "sheet_bg_transparent", panelClass: "_side_bottom",data: data });
        document.body.setAttribute("locked_region", "one_page_thumbnail_mode1")
        sheetRef.afterDismissed().subscribe(() => {
          if (document.body.getAttribute("locked_region") == "one_page_thumbnail_mode1" && this.opened) document.body.setAttribute("locked_region", "reader")
          this.opened = false;
        });
      }
      this.opened = true;
    }
  }

  isToggle = () => {
    if (this.opened) this.close()
    else this.open();
  }

  close() {
    this._sheet.dismiss();
  }
}
