import { Injectable } from '@angular/core';
interface Info {
  cover: string,
  title: string,
  read_chapter_id: string | number,
  author?: string,
  intro?: string
}
interface Item {
  id: string | number,
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
  chapters: Array<Item> = [];

  comics_id = "";
  info: Info = {
    cover: '',
    title: '',
    read_chapter_id: 0,
  };
  is_init_finish = false;

  constructor() { }
}
