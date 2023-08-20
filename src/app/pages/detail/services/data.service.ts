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
    chapter_id: ""
  };
  comics_id = "";
  chapter_id = "";
  page_index: number = 0;
  page_id = "";

  is_edit = false;
  is_locked = false;
  is_cache = false;

  constructor() { }
}
