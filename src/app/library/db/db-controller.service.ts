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

  async getDetail() {
    if (this.DbEvent.Event[this.AppData.origin] && this.DbEvent.Event[this.AppData.origin]["Detail"]) {
      const res = await this.DbEvent.Event[this.AppData.origin]["Detail"]()
      return res
    } else {
      return []
    }
  }
}