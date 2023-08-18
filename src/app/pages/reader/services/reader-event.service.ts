import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReaderEventService {
  events: any = {};

  configs: any = {};
  register$ = new Subject();

  constructor() { }

  _register(key: string, events: any) {
    this.events[key] = events;
    let config = this.events[key]['getConfig']()
    const json = localStorage.getItem(key);
    if (json) {
      const config_local = JSON.parse(json);
      config = { ...config, ...config_local }
    }
    this.configs[key] = config;
    this.register$.next({
      key:key,
      config:config
    })
    return config
  }

  _runEvent(key: string, eventName: string, data?: any) {
    if (this.events[key] && this.events[key][eventName]) {
      this.events[key][eventName](data)
      const config = this.events[key]['getConfig']();
      this._save(key, config)
      return config
    }

  }

  _save(key: string, config: any) {
    localStorage.setItem(key, JSON.stringify(config))
  }

  _getConfig(key: string) {
    return this.events[key]['getConfig']()
  }

}
