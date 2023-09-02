import { Injectable } from '@angular/core';
interface Events {
   name:string,
   fun:Function
}
@Injectable({
  providedIn: 'root'
})
export class EventService {

  public Events: { [key: string]: Events } = {};


  constructor() { }

  register(key: string, option: {
    name: string,
    fun: Function
  }) {
    this.Events[key] = option;
  }

}
