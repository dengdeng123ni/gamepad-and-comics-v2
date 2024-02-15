import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { DbEventService } from '../public-api';

@Injectable({
  providedIn: 'root'
})
export class AppDataService {
  origin = "hanime1"
  origin$ = new Subject();
  constructor(public DbEvent: DbEventService) { }

  setOrigin(origin:string) {
    this.origin = origin;
    const x = this.DbEvent.Configs['origin']
    this.origin$.next(x)
  }
  getOption(){
    return this.DbEvent.Configs[this.origin]
  }
}
