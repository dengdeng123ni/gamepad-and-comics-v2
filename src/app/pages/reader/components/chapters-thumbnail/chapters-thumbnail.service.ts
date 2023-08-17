import { Injectable } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ChaptersThumbnailComponent } from './chapters-thumbnail.component';

@Injectable({
  providedIn: 'root'
})
export class ChaptersThumbnailService {

  opened: boolean = false;
  constructor(
    public _sheet: MatBottomSheet,
  ) {
  }
  open() {
    if (this.opened == false) {
      // const images = this.current.images.list;
      // this.list=Object.keys(images).map(x=>({id:x,total:images[x].length,image:images[x][0].image}))
      if (this.opened == false) {
        const sheetRef = this._sheet.open(ChaptersThumbnailComponent,{
          panelClass:"_chapters_thumbnail"
        });
        document.body.setAttribute("locked_region", "chapters_thumbnail")
        sheetRef.afterDismissed().subscribe(() => {
          if (document.body.getAttribute("locked_region") == "chapters_thumbnail" && this.opened) document.body.setAttribute("locked_region", "reader")
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
