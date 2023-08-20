import { Injectable } from '@angular/core';
import { ComicsItem } from 'src/app/library/public-api';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  list: Array<ComicsItem> = [];

  is_edit = false;

  constructor() { }
}
