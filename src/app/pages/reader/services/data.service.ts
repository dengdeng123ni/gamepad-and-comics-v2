import { Injectable } from '@angular/core';
interface Item { id: string, src: string, width: string, height: string }
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
  comic_id = "";
  chapter_id = "";
  page_index = ""
  page_id = "";

  is_edit = false;


  constructor() { }
}
