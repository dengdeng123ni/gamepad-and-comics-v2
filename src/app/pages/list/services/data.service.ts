import { Injectable } from '@angular/core';
import { ComicsItem } from 'src/app/library/public-api';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  list: Array<ComicsItem> = [];
  is_edit = false;
  is_locked = false;
  is_cache = false;
  is_local_record = false;
  is_download = false;
  query_config={
    page_num:0,
    page_size:0
  }
  constructor() { }
}
