import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  list = [];

  is_init_finish= false;

  constructor() { }
}
