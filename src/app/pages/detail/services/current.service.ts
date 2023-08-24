import { Injectable } from '@angular/core';
import { DbControllerService } from 'src/app/library/public-api';
import { DataService } from './data.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CurrentService {
  private _chapters: any = {};
  constructor(
    public DbController: DbControllerService,
    public data: DataService,
    public webDb: NgxIndexedDBService,
    public router: Router,
  ) { }

  async init(comic_id: string) {
    this.data.is_init_free = false;
    this.data.comics_id = comic_id;
    const _res = await Promise.all([this.DbController.getDetail(comic_id), this._getWebDbComicsConfig(comic_id)])
    const res = _res[0];

    this.data.comics_config = _res[1];
    if (this.data.is_local_record) {
      this.data.chapters = res.chapters;
      const chapters = await this._getChapterRead(this.data.comics_id);
      const comics = await this._getComicsRead(this.data.comics_id);
      for (let index = 0; index < this.data.chapters.length; index++) {
        this.data.chapters[index].read = chapters[index].read;
      }
      console.log(comics);

      this.data.chapter_id = comics.chapter_id;
    } else {
      this.data.chapters = res.chapters;
      this.data.chapter_id = this.data.comics_info.chapter_id;
    }
    delete res.chapters;
    this.data.comics_info = res;
    this.data.is_init_free = true;
  }

  async close() {
    this.data.is_init_free = false;
  }

  async _getWebDbComicsConfig(id: string) {
    const res: any = await firstValueFrom(this.webDb.getByID("comics_config", id.toString()))
    if (res) {
      return { ...this.data.comics_config, ...res }
    } else {
      return this.data.comics_config
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
  async _getChapterIndex(id: string): Promise<number> {
    const res: any = await firstValueFrom(this.webDb.getByID("last_read_chapter_page", id.toString()))
    if (res) {
      return res.page_index
    } else {
      return 0
    }
  }
  async _chapterPageChange(chapter_id: string, page_index: number) {
    await this._setChapterIndex(chapter_id, page_index)
    this.router.navigate(['/', this.data.comics_id, this.data.chapter_id])

  }
  async _getChapterRead(id: string) {
    const res: any = await firstValueFrom(this.webDb.getByID("read_comics_chapter", id.toString()))
    if (res) {
      return res.chapters
    } else {
      return this.data.chapters.map(x => ({ id: x.id, read: 0 }))
    }
  }
  async _getComicsRead(comics_id: string) {
    const res: any = await firstValueFrom(this.webDb.getByID("read_comics", comics_id.toString()))
    if (res) {
      return res
    } else {
      return { 'comics_id': this.data.comics_id.toString(), chapter_id: this.data.chapters[0].id, chapter_title: this.data.chapters[0].title, chapters_length: this.data.chapters.length }
    }
  }
  async _setChapterIndex(id: string, index: number) {
    await firstValueFrom(this.webDb.update("last_read_chapter_page", { 'chapter_id': id.toString(), "page_index": index }))
  }
}
