import { Injectable } from '@angular/core';
import { AppDataService } from 'src/app/library/public-api';
import { DbEventService } from './db-event.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { firstValueFrom } from 'rxjs';
interface Item { id: string | number, cover: string, title: string, subTitle: string }
interface Events {
  List: Function;
  Detail: Function;
  Pages: Function;
  Image: Function
}
@Injectable({
  providedIn: 'root'
})
export class DbControllerService {

  lists: any = {};
  details: any = {};
  pages: any = {};

  cache = {
    details:false,
    pages:false
  }
  constructor(
    private AppData: AppDataService,
    private DbEvent: DbEventService,
    private webDb: NgxIndexedDBService,
  ) {

  }

  async getList(id: string, option?: {
    origin: string
  }): Promise<Array<Item>> {
    if (!option) option = { origin: this.AppData.origin }
    if (!option.origin) option.origin = this.AppData.origin;
    if (this.DbEvent.Events[option.origin] && this.DbEvent.Events[option.origin]["List"]) {
      if (this.lists[id]) {
        return JSON.parse(JSON.stringify(this.lists[id]))
      } else {
        const b64_to_utf8 = (str: string) => {
          return JSON.parse(decodeURIComponent(escape(window.atob(str))));
        }

        const obj = b64_to_utf8(id)
        const res = await this.DbEvent.Events[option.origin]["List"](obj);
        this.lists[id] = JSON.parse(JSON.stringify(res));
        return res
      }
    } else {
      return []
    }
  }
  async getDetail(id: string, option?: {
    origin: string
  }) {
    if (!option) option = { origin: this.AppData.origin }
    if (!option.origin) option.origin = this.AppData.origin;
    if (this.DbEvent.Events[option.origin] && this.DbEvent.Events[option.origin]["Detail"]) {
      if (this.details[id]) {
        return JSON.parse(JSON.stringify(this.details[id]))
      } else {
        if(this.DbEvent.Configs[option.origin].is_cache){
          const res = await firstValueFrom(this.webDb.getByID('details', id))
          if(res){
            this.details[id] = JSON.parse(JSON.stringify(res));
            return res
          }
        }
        const res = await this.DbEvent.Events[option.origin]["Detail"](id);
        firstValueFrom(this.webDb.update('details', res))
        this.details[id] = JSON.parse(JSON.stringify(res));
        return res
      }
    } else {
      return []
    }
  }
  async getPages(id: string, option?: {
    origin: string
  }) {
    if (!option) option = { origin: this.AppData.origin }
    if (!option.origin) option.origin = this.AppData.origin;
    if (this.DbEvent.Events[option.origin] && this.DbEvent.Events[option.origin]["Pages"]) {
      if (this.pages[id]) {
        return JSON.parse(JSON.stringify(this.pages[id]))
      } else {
        if(this.DbEvent.Configs[option.origin].is_cache){
          const res = await firstValueFrom(this.webDb.getByID('pages', id))
          if (res) {
            this.pages[id] = JSON.parse(JSON.stringify(res));
            return res
          }
        }
        const res = await this.DbEvent.Events[option.origin]["Pages"](id);
        firstValueFrom(this.webDb.update('pages', res))
        this.pages[id] = JSON.parse(JSON.stringify(res));

        return res
      }
    } else {
      return []
    }
  }
  async getImage(id: string, option?: {
    origin: string
  }) {
    if (!option) option = { origin: this.AppData.origin }
    if (!option.origin) option.origin = this.AppData.origin;
    if (this.DbEvent.Events[option.origin] && this.DbEvent.Events[option.origin]["Image"]) {
      const res = await this.DbEvent.Events[option.origin]["Image"](id)
      return res
    } else {
      return []
    }
  }
}
