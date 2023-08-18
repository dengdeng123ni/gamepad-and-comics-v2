import { Injectable } from '@angular/core';
import { DbControllerService } from 'src/app/library/public-api';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class CurrentService {

  constructor(
    public DbController: DbControllerService,
    public data: DataService
  ) { }

  async init(id: string) {
    this.data.comics_id=id;
    const res = await this.DbController.getDetail(id);
    this.data.chapters = res.chapters;
    delete res.chapters;
    this.data.info = res;
    this.data.chapter_id=this.data.info.chapter_id;

  }
}
