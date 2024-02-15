import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { firstValueFrom } from 'rxjs';
import { AppDataService } from '../public-api';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  constructor(public webDb: NgxIndexedDBService, public AppData: AppDataService) { }


  async update(obj: {
    id: string,
    title: string,
    cover: string
  }) {
    await firstValueFrom(this.webDb.update("history", { ...obj, origin: this.AppData.origin, last_read_date: new Date().getTime() }))
  }

  async getAll() {
    const list = await firstValueFrom(this.webDb.getAll("history"));
    return list
  }

}
