import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { DbControllerService } from 'src/app/library/public-api';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrentService {

  _chapters: any = {};

  constructor(
    public DbController: DbControllerService,
    public Data: DataService
  ) {

    this.on$.subscribe(event$ => {
      const { x, y } = event$;
      const { innerWidth, innerHeight } = window;
       if (x < (innerWidth / 2)) this.previousPage$.next(event$)
        else this.nextPage$.next(event$)
    })
  }

  public mode$ = new Subject<number>();

  public on$ = new Subject<MouseEvent>();

  public delete$ = new Subject();

  public initBefore$ = new Subject<any>();
  public init$ = new Subject<any>();
  public initAfter$ = new Subject();

  public pageBefore$ = new Subject<number>();
  public page$ = new Subject<number>();
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

  async _init(comic_id: string, chapter_id: string) {
    this.Data.chapter_id = chapter_id;
    this.Data.comic_id = comic_id;
    const list = await this.DbController.getImages(chapter_id);
    this.init$.next(list)
    this.Data.images = list;
    const res = await this.DbController.getDetail(comic_id);
    this.Data.chapters = res.chapters;
    delete res.chapters;
    this.Data.info = res;
  }


  async _getNextChapter() {
    const index = this.Data.chapters.findIndex(x => x.id == this.Data.chapter_id);
    const obj = this.Data.chapters[index + 1];
    if (obj) {
      const id = obj.id;
      return await this._getChapter(id);
    } else {
      this.pageLastAfter$.next();
    }
  }

  async _getPreviousChapter() {
    const index = this.Data.chapters.findIndex(x => x.id == this.Data.chapter_id);
    const obj = this.Data.chapters[index - 1];
    if (obj) {
      const id = obj.id;
      return await this._getChapter(id);
    } else {
      this.pageFirstBefore$.next();
    }
  }

  async _getChapter(id: string) {
    this.chapterBefore$.next(this.Data.chapters);
    this.Data.chapter_id=id;
    let list = [];
    if (this._chapters[id]) {
      list = this._chapters[id]
    } else {
      list = await this.DbController.getImages(id);
      this._chapters[id] = list;
    }
    this.chapter$.next(this.Data.chapters);
    this.chapterAfter$.next(this.Data.chapters);
    this.Data.images=list;
    return list
  }

  async _getNextChapter_2() {
    const index = this.Data.chapters.findIndex(x => x.id == this.Data.chapter_id);
    const obj = this.Data.chapters[index + 1];
    if (obj) {
      const id = obj.id;
      return await this._getChapter_2(id);
    }
  }

  async _getPreviousChapter_2() {
    const index = this.Data.chapters.findIndex(x => x.id == this.Data.chapter_id);
    const obj = this.Data.chapters[index - 1];
    if (obj) {
      const id = obj.id;
      return await this._getChapter_2(id);
    }
  }

  async _getChapter_2(id: string) {
    let list = [];
    if (this._chapters[id]) {
      list = this._chapters[id]
    } else {
      list = await this.DbController.getImages(id);
      this._chapters[id] = list;
    }
    return list
  }

  async _pageChange(index: number) {
    this.pageBefore$.next(index);
    this.page$.next(index);
    this.pageAfter$.next(index);
  }

  async _chapterChange(index: number) {

  }

  async _getChapterIndex(id: string | number) {

  }





}
