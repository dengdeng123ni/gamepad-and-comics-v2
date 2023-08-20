import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { DbControllerService, PagesItem } from 'src/app/library/public-api';
import { Subject, firstValueFrom } from 'rxjs';
import { NgxIndexedDBService } from 'ngx-indexed-db';

@Injectable({
  providedIn: 'root'
})
export class CurrentService {

  _chapters: any = {};

  is_init_free = false;

  reader_modes = ['double_page_reader', 'up_down_page_reader', 'left_right_page_reader', 'one_page_reader']
  constructor(
    public DbController: DbControllerService,
    public data: DataService,
    public webDb: NgxIndexedDBService
  ) {
    this.reader_mode_change$.subscribe(x => {
      if (this.reader_modes.includes(x)) this.data.comics_config.reader_mode = x;
      else this.data.comics_config.reader_mode = "double_page_reader";
      if (this.data.comics_config.reader_mode == "double_page_reader") this.data.comics_config.is_double_page = true;
      else this.data.comics_config.is_double_page = false;
    })

  }


  public on$ = new Subject<MouseEvent>();

  public delete$ = new Subject();

  public change$ = new Subject<{
    type: string,
    pages: Array<PagesItem>,
    page_index: number,
    chapter_id?: string,
    trigger?: string
  }>();

  public init$ = new Subject<any>();

  // public page$ = new Subject<any>();

  // public chapter$ = new Subject<any>();

  public imageReadingTime$ = new Subject<any>();

  public comicsLast$ = new Subject();
  public comicsFirst$ = new Subject();

  public pageFirstBefore$ = new Subject<void>();
  public pageLastAfter$ = new Subject<void>();

  public chapterEnd$ = new Subject();
  public chapterStart$ = new Subject();
  public chapterPrevious$ = new Subject<any>();
  public chapterNext$ = new Subject<any>();

  public chapterFirstBefore$ = new Subject<void>();
  public chapterLastAfter$ = new Subject<void>();


  public switch$ = new Subject();
  public readerNavbarBar$ = new Subject();

  public previousPage$ = new Subject();
  public nextPage$ = new Subject();

  public reader_mode_change$ = new Subject<string>();


  public readerModeChange() {
    return this.reader_mode_change$
  }


  public previousPage() {
    return this.previousPage$
  }
  public nextPage() {
    return this.nextPage$
  }
  public readerNavbarBar() {
    return this.readerNavbarBar$
  }
  public switch() {
    return this.switch$
  }
  public delete() {
    return this.delete$
  }
  public init() {
    return this.init$
  }
  // public page() {
  //   return this.page$
  // }
  // public chapter() {
  //   return this.chapter$
  // }
  public comicsLast() {
    return this.comicsLast$
  }
  public comicsFirst() {
    return this.comicsFirst$
  }
  public chapterEnd() {
    return this.chapterEnd$
  }
  public chapterStart() {
    return this.chapterStart$
  }
  public chapterPrevious() {
    return this.chapterPrevious$
  }
  public chapterNext() {
    return this.chapterNext$
  }
  public change() {
    return this.change$
  }

  async _init(comic_id: string, chapter_id: string) {
    this.is_init_free = false;
    this.data.chapter_id = chapter_id;
    this.data.comics_id = comic_id;
    const list = await this.DbController.getPages(chapter_id);
    this.init$.next(list)
    this.data.pages = list;
    const res = await this.DbController.getDetail(comic_id);
    this.data.chapters = res.chapters;
    delete res.chapters;
    this.data.comics_info = res;
    this.data.page_index = await this._getChapterIndex(chapter_id);
    this.is_init_free = true;
  }


  async _setNextChapter() {
    const index = this.data.chapters.findIndex(x => x.id == this.data.chapter_id);
    const obj = this.data.chapters[index + 1];
    if (obj) {
      const id = obj.id;
      return await this._setChapter(id);
    } else {
      this.pageLastAfter$.next();
    }
  }

  async _setPreviousChapter() {
    const index = this.data.chapters.findIndex(x => x.id == this.data.chapter_id);
    const obj = this.data.chapters[index - 1];
    if (obj) {
      const id = obj.id;
      return await this._setChapter(id);
    } else {
      this.pageFirstBefore$.next();
    }
  }

  async _setChapter(id: string) {
    this.data.chapter_id = id;
    let list = await this._getChapter(id);
    this.data.pages = list;
    return list
  }

  async _getNextChapter() {
    const index = this.data.chapters.findIndex(x => x.id == this.data.chapter_id);
    const obj = this.data.chapters[index + 1];
    if (obj) {
      const id = obj.id;
      return await this._getChapter(id);
    }
  }

  async _getPreviousChapter() {
    const index = this.data.chapters.findIndex(x => x.id == this.data.chapter_id);
    const obj = this.data.chapters[index - 1];
    if (obj) {
      const id = obj.id;
      return await this._getChapter(id);
    }
  }

  async _getChapter(id: string) {
    let list = [];
    if (this._chapters[id]) {
      list = this._chapters[id]
    } else {
      list = await this.DbController.getPages(id);
      this._chapters[id] = list;
    }
    return list
  }


  async _chapterNext() {
    const index = this.data.chapters.findIndex(x => x.id == this.data.chapter_id);
    const obj = this.data.chapters[index + 1];
    if (obj) {
      const id = obj.id;
      await this._chapterPageChange(id, 0);
      return true
    } else {
      return false
    }
  }

  async _chapterPrevious() {
    const index = this.data.chapters.findIndex(x => x.id == this.data.chapter_id);
    const obj = this.data.chapters[index - 1];
    if (obj) {
      const id = obj.id;
      await this._chapterPageChange(id, 0);
      return true
    } else {
      return false
    }
  }

  async _chapterPageChange(chapter_id: string, page_index: number) {
    const pages = await this._setChapter(chapter_id);
    this._change('changeChapter', { chapter_id, pages, page_index })
  }
  async _chapterChange(chapter_id: string) {
    const pages = await this._setChapter(chapter_id);
    let page_index = await this._getChapterIndex(chapter_id);
    if (pages.length - 2 < page_index) page_index = 0;
    this._change('changeChapter', { chapter_id, pages, page_index })
  }
  async _pageChange(page_index: number) {
    this._change('changePage', { chapter_id: this.data.chapter_id, pages: this.data.pages, page_index })
  }

  async _getChapterIndex(id: string): Promise<number> {
    const res: any = await firstValueFrom(this.webDb.getByID("last_read_chapter_page", id.toString()))
    if (res) {
      return res.page_index
    } else {
      return 0
    }
  }

  async _setChapterIndex(id: string, index: number) {
    await firstValueFrom(this.webDb.update("last_read_chapter_page", { 'chapter_id': id.toString(), "page_index": index }))
  }

  async _change(type: string, option: {
    pages: Array<PagesItem>,
    page_index: number,
    chapter_id?: string,
    trigger?: string
  }) {
    this.data.page_index = option.page_index;
    this.data.pages = option.pages;
    if (option.chapter_id) this.data.chapter_id = option.chapter_id;
    const types = ['initPage', 'closePage', 'changePage', 'nextPage', 'previousPage', 'nextChapter', 'previousChapter', 'changeChapter'];
    this.change$.next({ ...option, type })
  }




}
