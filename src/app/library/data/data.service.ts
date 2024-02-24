import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { DbEventService } from '../public-api';

@Injectable({
  providedIn: 'root'
})
export class AppDataService {
  origin = "bilibili"
  origin$ = new Subject();
  constructor(public DbEvent: DbEventService) {
    const c = localStorage.getItem('origin');
    if (c) {
      this.origin = c;
    }
  }

  setOrigin(origin: string) {
    this.origin = origin;
    const x = this.DbEvent.Configs['origin']
    localStorage.setItem('origin', origin)
    this.origin$.next(x)
  }
  getOption() {
    return this.DbEvent.Configs[this.origin]
  }
}
