import { Injectable } from '@angular/core';
import { ComicsItem } from 'src/app/library/public-api';
declare const window: any;
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

  is_loading_free=false;

  qurye_page_type="home"
  constructor() {
    window.comics_query_option={
      page_num:0,
      page_size:0
    }
  }
}
