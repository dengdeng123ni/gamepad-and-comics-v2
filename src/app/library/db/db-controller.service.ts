import { Injectable } from '@angular/core';
import { AppDataService } from 'src/app/library/public-api';
import { DbEventService } from './db-event.service';
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
  constructor(
    private AppData: AppDataService,
    private DbEvent: DbEventService,
  ) {

  }

  async getList(): Promise<Array<Item>> {
    if (this.DbEvent.Events[this.AppData.origin] && this.DbEvent.Events[this.AppData.origin]["List"]) {
      const res = await this.DbEvent.Events[this.AppData.origin]["List"]()
      return res
    } else {
      return []
    }
  }
  async getDetail(id: string) {
    if (this.DbEvent.Events[this.AppData.origin] && this.DbEvent.Events[this.AppData.origin]["Detail"]) {
      if (this.details[id]) {
        return JSON.parse(JSON.stringify(this.details[id]))
      } else {
        const res = await this.DbEvent.Events[this.AppData.origin]["Detail"](id);
        this.details[id] = JSON.parse(JSON.stringify(res));
        return res
      }
    } else {
      return []
    }
  }
  async getPages(id: string) {
    if (this.DbEvent.Events[this.AppData.origin] && this.DbEvent.Events[this.AppData.origin]["Pages"]) {
      if (this.pages[id]) {
        return JSON.parse(JSON.stringify(this.pages[id]))
      } else {
        const res = await this.DbEvent.Events[this.AppData.origin]["Pages"](id);
        this.pages[id] = JSON.parse(JSON.stringify(res));
        return res
      }
    } else {
      return []
    }
  }
  async getImage(id: string) {
    if (this.DbEvent.Events[this.AppData.origin] && this.DbEvent.Events[this.AppData.origin]["Image"]) {
      const res = await this.DbEvent.Events[this.AppData.origin]["Image"](id)
      return res
    } else {
      return []
    }
  }
}
