import { Injectable } from '@angular/core';
import { DbControllerService } from '../db/db-controller.service';
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
    this.Data.list = await this.DbController.getList();
  }



}
