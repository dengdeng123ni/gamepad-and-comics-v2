import { Injectable } from '@angular/core';
interface Item { id: string, src: string, width: number, height: number }
interface Info {
  cover: string,
  title: string,
  author?: string,
  intro?: string
}
interface ChaptersItem {
  id: string,
  cover: string,
  title: string,
  short_title?: string,
  pub_time?: string | Date | number,
  read?: number,
  ord?: number,
  selected?: boolean,
  like_count?: number | string,
  comments?: number | string,
}
// double_page_reader up_down_page_reader left_right_page_reader one_page_reader
@Injectable({
  providedIn: 'root'
})
export class DataService {

  pages: Array<Item> = [];
  chapters: Array<ChaptersItem> = [];
  info: Info = {
    cover: '',
    title: ''
  };
  comics_id = "";
  chapter_id = "";
  page_index: number = 0;
  page_id: string = "";

  is_edit = false;
  is_locked = false;
  is_cache = false;

  comics_config = {
    reader_mode: "double_page_reader",
    is_page_order: false,
    is_page_direction: true,
    is_first_page_cover: true
  }

  constructor() { }
}
