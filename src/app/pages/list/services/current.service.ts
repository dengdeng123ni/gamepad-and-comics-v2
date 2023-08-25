import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { DbControllerService } from 'src/app/library/public-api';

@Injectable({
  providedIn: 'root'
})
export class CurrentService {

  constructor(
    public DbController: DbControllerService,
    public Data: DataService
  ) { }

  async init() {

  }

  async getList(page_num: number, page_size: number) {
    const id = this.utf8_to_b64(JSON.stringify({ page_num, page_size }))
    const list = await this.DbController.getList(id);
    return list
  }
  utf8_to_b64(str: string) {
    return window.btoa(unescape(encodeURIComponent(str)));
  }




}
