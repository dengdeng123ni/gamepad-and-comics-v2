import { Injectable } from '@angular/core';
import { AppDataService } from 'src/app/library/public-api';
import { DbEventService } from './db-event.service';
interface Item { id: string | number, cover: string, title: string, subTitle: string }
@Injectable({
  providedIn: 'root'
})
export class DbControllerService {

  constructor(
    private AppData: AppDataService,
    private DbEvent: DbEventService,
  ) {

  }

  async getList():Promise<Array<Item>> {
    if (this.DbEvent.Event[this.AppData.origin] && this.DbEvent.Event[this.AppData.origin]["List"]) {
      const res = await this.DbEvent.Event[this.AppData.origin]["List"]()
      return res
    } else {
      return []
    }
  }
  async getDetail(id:string) {
    if (this.DbEvent.Event[this.AppData.origin] && this.DbEvent.Event[this.AppData.origin]["Detail"]) {
      const res = await this.DbEvent.Event[this.AppData.origin]["Detail"](id)
      return res
    } else {
      return []
    }
  }
  async getPages(id:string) {
    if (this.DbEvent.Event[this.AppData.origin] && this.DbEvent.Event[this.AppData.origin]["Pages"]) {
      const res = await this.DbEvent.Event[this.AppData.origin]["Pages"](id)
      return res
    } else {
      return []
    }
  }
  async getImage(id:string) {
    if (this.DbEvent.Event[this.AppData.origin] && this.DbEvent.Event[this.AppData.origin]["Image"]) {
      const res = await this.DbEvent.Event[this.AppData.origin]["Image"](id)
      return res
    } else {
      return []
    }
  }
}
