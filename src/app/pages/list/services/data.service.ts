import { Injectable } from '@angular/core';
interface Item { id: string | number, cover: string, title: string, subTitle: string }
@Injectable({
  providedIn: 'root'
})
export class DataService {

  list: Array<Item> = [];

  is_init_finish = false;

  constructor() { }
}
