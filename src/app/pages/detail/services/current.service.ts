import { Injectable } from '@angular/core';
import { DbControllerService } from 'src/app/library/public-api';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class CurrentService {

  constructor(
    public DbController: DbControllerService,
    public Data: DataService
  ) { }

  async init() {
    const res = await this.DbController.getDetail();
    this.Data.list = res.chapters;
    delete res.chapters;
    this.Data.info = res
  }
}
