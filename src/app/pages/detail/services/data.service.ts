import { Injectable } from '@angular/core';
interface Info {
  cover: string,
  title: string,
  author?: string,
  intro?: string
}
@Injectable({
  providedIn: 'root'
})
export class DataService {

  list = [];
  info:Info = {
    cover: '',
    title: ''
  };
  is_init_finish= false;

  constructor() { }
}
