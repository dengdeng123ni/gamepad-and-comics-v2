import { Injectable } from '@angular/core';
import { DbControllerService } from 'src/app/library/public-api';
import { DataService } from './data.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrentService {
  private _chapters: any = {};
  constructor(
    public DbController: DbControllerService,
    public data: DataService,
    public webDb: NgxIndexedDBService,
  ) { }

  async init(comic_id: string) {
    this.data.is_init_free = false;
    this.data.comics_id = comic_id;
    const _res = await Promise.all([this.DbController.getDetail(comic_id),this._getWebDbComicsConfig(comic_id)])
    const res=_res[0];
    this.data.comics_config = _res[1];
    this.data.chapters = res.chapters;
    delete res.chapters;
    this.data.comics_info = res;
    this.data.chapter_id = this.data.comics_info.chapter_id;
    this.data.is_init_free = true;
  }

  async close(){
    this.data.is_init_free = false;
  }

  async _getWebDbComicsConfig(id: string) {
    const res:any = await firstValueFrom(this.webDb.getByID("comics_config", id.toString()))
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

  }
}
