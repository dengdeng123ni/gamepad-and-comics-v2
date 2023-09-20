import { Injectable } from '@angular/core';
import { CurrentService } from '../../services/current.service';
import { DataService } from '../../services/data.service';
import { ChaptersThumbnailService } from '../../components/chapters-thumbnail/chapters-thumbnail.service';
import { DoublePageThumbnailService } from '../../components/double-page-thumbnail/double-page-thumbnail.service';
import { OnePageThumbnailMode3Service } from '../../components/one-page-thumbnail-mode3/one-page-thumbnail-mode3.service';
import { OnePageThumbnailMode1Service } from '../../components/one-page-thumbnail-mode1/one-page-thumbnail-mode1.service';
import { OnePageThumbnailMode2Service } from '../../components/one-page-thumbnail-mode2/one-page-thumbnail-mode2.service';
import { EventService } from '../../services/event.service';
import { ReaderChangeService } from '../../components/reader-change/reader-change.service';
import { SetChapterFirstPageCoverService } from '../../components/set-chapter-first-page-cover/set-chapter-first-page-cover.service';

@Injectable({
  providedIn: 'root'
})
export class IndexService {

  constructor(
    public current: CurrentService,
    public data: DataService,
    public doublePageThumbnail: DoublePageThumbnailService,
    public chaptersThumbnail: ChaptersThumbnailService,
    public onePageThumbnailMode1: OnePageThumbnailMode1Service,
    public onePageThumbnailMode2: OnePageThumbnailMode2Service,
    public onePageThumbnailMode3: OnePageThumbnailMode3Service,
    public event: EventService,
    public ReaderChange: ReaderChangeService,
    public SetChapterFirstPageCover:SetChapterFirstPageCoverService,
  ) {
    this.current.on$.subscribe(event$ => {
      const { x, y } = event$;
      const { innerWidth, innerHeight } = window;
      if (x > (innerWidth * 0.33) && x < (innerWidth * 0.66) && y > (innerHeight * 0.33) && y < (innerHeight * 0.66)) {
        this.current.readerNavbarBar$.next(true)
      } else if (x > (innerWidth * 0.33) && x < (innerWidth * 0.66) && y > (innerHeight * 0) && y < (innerHeight * 0.33)) {
        if (data.comics_config.is_double_page) {
          this.doublePageThumbnail.isToggle();
        } else {
          this.onePageThumbnailMode3.isToggle();
        }
      } else if (x > (innerWidth * 0.33) && x < (innerWidth * 0.66) && y > (innerHeight * 0.66) && y < (innerHeight * 1)) {
        this.chaptersThumbnail.isToggle();
      } else {
        if (x < (innerWidth / 2)) {
          this.current._change("previousPage", {
            pages: this.data.pages,
            page_index: this.data.page_index,
            chapter_id:this.data.chapter_id
          })
        }
        else {
          this.current._change("nextPage", {
            pages: this.data.pages,
            page_index: this.data.page_index,
            chapter_id:this.data.chapter_id
          })
        }
      }
    })
    event.register('double_page_thumbnail', {
      icon:"grid_view",
      name: "双页缩略图",
      fun: () => doublePageThumbnail.isToggle
    })
    event.register('one_page_thumbnail_list', {
      name: "单页列表缩略图",
      icon:"view_comfy",
      fun: () => onePageThumbnailMode1.isToggle
    })
    event.register('one_page_thumbnail_left', {
      name: "单页左侧缩略图",
      icon:"view_sidebar",
      fun: () => onePageThumbnailMode2.isToggle
    })
    event.register('double_page_thumbnail_bottom', {
      name: "单页下方缩略图",
      icon:"vertical_split",
      fun: () => onePageThumbnailMode3.isToggle
    })
    event.register('toolbar', {
      name: "工具栏",
      icon:"view_day",
      fun: () => this.current.readerNavbarBar$.next(true)
    })
    event.register('chapters_previous', {
      name: "上一章",
      icon:"chevron_left",
      fun: () => this.previous
    })
    event.register('chapters_next', {
      name: "下一章",
      icon:"chevron_right",
      fun: () => this.next
    })
    event.register('chapters_thumbnail', {
      name: "章节缩略图",
      icon:"subject",
      fun: () => chaptersThumbnail.isToggle
    })
    event.register('toggle_page', {
      name: "跨页匹配",
      icon:"swap_horiz",
      fun: () => this.togglePage
    })

    event.register('back', {
      name: "返回",
      icon:"keyboard_return",
      fun: () => this.back
    })
    event.register('back', {
      name: "阅读模式",
      icon:"chrome_reader_mode",
      fun: () => ReaderChange.isToggle()
    })

    event.register('double_page_first_page_toggle', {
      name: "设置第一页为封面",
      icon:"radio_button_checked",
      fun: () => this.firstPageCoverChange
    })
    event.register('page_previous', {
      name: "上一页",
      icon:"first_page",
      fun: () => this.current._pagePrevious()
    })
    event.register('page_next', {
      name: "下一页",
      icon:"last_page",
      fun: () => this.current._pageNext()
    })
    event.register('full', {
      name: "全屏",
      icon:"fullscreen",
      fun: () => this.current._pageNext()
    })
    event.register('chapters_list', {
      name: "(小)章节列表",
      icon:"subject",
      fun: () => this.current._pageNext()
    })
    event.register('rotation', {
      name: "旋转",
      icon:"screen_rotation",
      fun: () => this.current._pageNext()
    })


  }
  back() {
    window.history.back()
  }
  firstPageCoverChange() {
    this.current.event$.next({ key: "double_page_reader_FirstPageToggle", value: null })
  }
  togglePage() {
    this.current.event$.next({ key: "double_page_reader_togglePage", value: null })
  }
  togglePage2() {
    this.current.event$.next({ key: "left_right_page_reader_togglePage", value: null })
  }
  previous() {
    this.current._chapterPrevious();
  }
  next() {
    this.current._chapterNext();
  }
}
