import { Injectable } from '@angular/core';
import { AppDataService } from 'src/app/library/public-api';
import { DbEventService } from './db-event.service';

@Injectable({
  providedIn: 'root'
})
export class DbControllerService {

  constructor(
    private AppData: AppDataService,
    private DbEvent: DbEventService,
  ) {

  }

  async getList() {
    if (this.DbEvent.Event[this.AppData.origin] && this.DbEvent.Event[this.AppData.origin]["List"]) {
      const res = await this.DbEvent.Event[this.AppData.origin]["List"]()
      return res
    } else {
      return []
    }
  }
}
