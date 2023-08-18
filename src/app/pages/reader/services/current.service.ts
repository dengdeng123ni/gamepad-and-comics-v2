import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { DbControllerService } from 'src/app/library/public-api';
import { Subject, firstValueFrom } from 'rxjs';
import { NgxIndexedDBService } from 'ngx-indexed-db';

@Injectable({
  providedIn: 'root'
})
export class CurrentService {

  _chapters: any = {};

  constructor(
    public DbController: DbControllerService,
    public data: DataService,
    public webDb: NgxIndexedDBService
  ) {

    this.on$.subscribe(event$ => {
      const { x, y } = event$;
      const { innerWidth, innerHeight } = window;
      if (x < (innerWidth / 2)) this.previousPage$.next(event$)
      else this.nextPage$.next(event$)
    })
    this.page$.subscribe(index => {
      this._setChapterIndex(this.data.chapter_id, index)
    })
  }


  public mode$ = new Subject<number>();

  public on$ = new Subject<MouseEvent>();

  public delete$ = new Subject();

  public change$ = new Subject<any>();

  public initBefore$ = new Subject<any>();
  public init$ = new Subject<any>();
  public initAfter$ = new Subject();

  public pageBefore$ = new Subject<number>();
  public page$ = new Subject<any>();
  public pageAfter$ = new Subject<number>();

  public chapterBefore$ = new Subject<any>();
  public chapter$ = new Subject<any>();
  public chapterAfter$ = new Subject<any>();

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
  public initAfter() {
    return this.initAfter$
  }
  public init() {
    return this.init$
  }
  public initBefore() {
    return this.initBefore$
  }
  public page() {
    return this.page$
  }
  public chapter() {
    return this.chapter$
  }
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
  public chapterBefore() {
    return this.chapterBefore$
  }
  public pageBefore() {
    return this.pageBefore$
  }
  public pageAfter() {
    return this.pageAfter$
  }

  public change() {
    return this.change$
  }

  async _init(comic_id: string, chapter_id: string) {
    this.data.chapter_id = chapter_id;
    this.data.comics_id = comic_id;
    const list = await this.DbController.getPages(chapter_id);
    this.init$.next(list)
    this.data.pages = list;
    const res = await this.DbController.getDetail(comic_id);
    this.data.chapters = res.chapters;
    delete res.chapters;
    this.data.info = res;
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
    this.chapterBefore$.next(this.data.chapters);
    this.data.chapter_id = id;
    let list = await this._getChapter(id);
    this.chapter$.next(this.data.chapters);
    this.chapterAfter$.next(this.data.chapters);
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
      await this._chapterChange(id);
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
      await this._chapterChange(id);
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
    const page_index = await this._getChapterIndex(chapter_id);
    this._change('changeChapter', { chapter_id, pages, page_index })
  }
  async _pageChange(page_index: number) {
    this._change('changePage', { chapter_id: this.data.chapter_id, pages: this.data.pages, page_index })
  }

  async _getChapterIndex(id: string): Promise<number> {
    const res: any = await firstValueFrom(this.webDb.getByID("last_read_chapter_page", id))
    if (res) {
      return res.page_index
    } else {
      return 0
    }
  }

  async _setChapterIndex(id: string, index: number) {
    await firstValueFrom(this.webDb.update("last_read_chapter_page", { 'chapter_id': id, "page_index": index }))
  }

  async _change(type: string, option: {
    pages: Array<any>,
    page_index: number,
    page_id?: string,
    chapter_id?: string,
    trigger?: string
  }) {
    this.data.page_index = option.page_index;
    this.data.pages = option.pages;
    if (option.chapter_id) this.data.chapter_id = option.chapter_id;
    const types = ['initPage', 'closePage', 'changePage', 'nextPage', 'previousPage', 'nextChapter', 'previousChapter', 'changeChapter'];
    if (type == "changePage") this._page(option)
    if (type == "changeChapter") this._chapter(option)
    console.log(option);

    this.change$.next({ ...option, type, comic_id: this.data.comics_id })
  }

  async _chapter(option: {
    pages: Array<any>,
    page_index: number,
    page_id?: string,
    chapter_id?: string,
    trigger?: string
  }) {
    this.chapter$.next(option)
  }
  async _page(option: {
    pages: Array<any>,
    page_index: number,
    page_id?: string,
    chapter_id?: string,
    trigger?: string
  }) {
    this.page$.next(option)
  }




}
