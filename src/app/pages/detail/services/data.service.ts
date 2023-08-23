import { Injectable } from '@angular/core';
import { ChaptersItem, ComicsInfo, PagesItem } from 'src/app/library/public-api';
@Injectable({
  providedIn: 'root'
})
export class DataService {
  pages: Array<PagesItem> = [];
  chapters: Array<ChaptersItem> = [];
  comics_info: ComicsInfo = {
    cover: '',
    title: '',
    chapter_id: ''
  };
  comics_id = "";
  chapter_id = "";
  page_index: number = 0;
  page_id: string = "";

  is_edit = false;

  is_locked = false;
  is_cache = false;
  is_local_record = false;
  is_download = false;

  comics_config = {
    reader_mode: "double_page_reader",
    is_page_order: false,
    is_page_direction: true,
    is_first_page_cover: true,
    is_double_page: true,
  }

  chapter_config = {
    is_cover_exist: false,
  }

  is_init_free = false;


  constructor() { }
}
