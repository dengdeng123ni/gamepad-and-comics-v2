import { Injectable } from '@angular/core';
import { CurrentService } from '../../services/current.service';
import { DataService } from '../../services/data.service';
import { ChaptersThumbnailService } from '../../components/chapters-thumbnail/chapters-thumbnail.service';
import { DoublePageThumbnailService } from '../../components/double-page-thumbnail/double-page-thumbnail.service';

@Injectable({
  providedIn: 'root'
})
export class IndexService {

  constructor(
    public current: CurrentService,
    public data: DataService,
    public doublePageThumbnail: DoublePageThumbnailService,
    public chaptersThumbnail: ChaptersThumbnailService,
  ) {
    this.current.on$.subscribe(event$ => {
      const { x, y } = event$;
      const { innerWidth, innerHeight } = window;
      if (x > (innerWidth * 0.33) && x < (innerWidth * 0.66) && y > (innerHeight * 0.33) && y < (innerHeight * 0.66)) {
        this.current.readerNavbarBar$.next(true)
      } else if (x > (innerWidth * 0.33) && x < (innerWidth * 0.66) && y > (innerHeight * 0) && y < (innerHeight * 0.33)) {
        this.doublePageThumbnail.isToggle();
      } else if (x > (innerWidth * 0.33) && x < (innerWidth * 0.66) && y > (innerHeight * 0.66) && y < (innerHeight * 1)) {
        this.chaptersThumbnail.isToggle();
      } else {
        if (x < (innerWidth / 2)) {
          this.current._change("previousPage", {
            pages: this.data.pages,
            page_index: this.data.page_index
          })
        }
        else {
          this.current._change("nextPage", {
            pages: this.data.pages,
            page_index: this.data.page_index
          })
        }
      }

    })
  }
}
