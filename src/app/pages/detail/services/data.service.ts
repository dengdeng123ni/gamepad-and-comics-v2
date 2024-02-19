import { Injectable } from '@angular/core';
import { AppDataService, ChaptersItem, ComicsInfo, PagesItem } from 'src/app/library/public-api';
@Injectable({
  providedIn: 'root'
})
export class DataService {
  pages: Array<PagesItem> = [];
  chapters: Array<ChaptersItem> = [];
  comics_info: ComicsInfo = {
    cover: '',
    title: '',
    author: [],
    styles: [],
    intro: "",
    chapter_id: ''
  };
  comics_id = "";
  chapter_id = "";
  page_index: number = 0;
  page_id: string = "";

  is_edit = false;
  edit = false
  is_locked = true;
  is_cache = false;
  // is_local_record 是否开启 本地阅读记录
  is_local_record = true;
  is_download = false;
  is_offprint = false;

  comics_config = {
    reader_mode: "double_page_reader",
    is_page_order: false,
    is_page_direction: true,
    is_double_page: true,
  }

  chapter_config = {
    is_cover_exist: false,
  }

  is_init_free = false;

  is_left_drawer_opened = false;

  left_drawer_mode: any = 'over';

  constructor(public AppData: AppDataService) {


  }

  init() {
    const obj = this.AppData.getOption();
    this.edit = obj.is_edit;
    this.is_locked = obj.is_locked;
    this.is_cache = obj.is_cache;
    this.is_offprint = obj.is_offprint;
  }
}
