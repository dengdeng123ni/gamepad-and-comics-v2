import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AppDataService, DbControllerService, DbEventService, QueryService } from '../public-api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.scss']
})
export class QueryComponent {
  _keyword = "";
  get keyword() { return this._keyword };
  set keyword(value: string) {
    // this.current.search(value);
    this.getComicsId(value)
    this._keyword = value;

  }
  filteredOptions: Observable<string[]> | undefined;
  constructor(
    public DbEvent: DbEventService,
    public DbController:DbControllerService,
    public AppData:AppDataService,
    public router:Router,
    public query:QueryService
    ) {

  }
  async getComicsId(value) {
    const url = new URL(value);
    if (url.protocol.substring(0, 4) == "http") {
      let proxy_hostnames = [];
      Object.keys(this.DbEvent.Configs).forEach(x => this.DbEvent.Configs[x].tab.host_names.forEach(c => proxy_hostnames.push({ url: this.DbEvent.Configs[x].tab.url,name:this.DbEvent.Configs[x].name, host_name: c })))
      const obj= proxy_hostnames.find(x=>x.host_name==url.hostname)
      if(!obj) return
      const arr = url.pathname.split("/")
      const id= arr.at(-1).replace(/[^\d]/g, " ")
      const bool= await this.DbController.getDetail(id,{origin:obj.name})
      if(bool){
        this.AppData.setOrigin(obj.name)
        this.router.navigate(['/detail', id.toString().trim()]);
        this.query.close();
      }
    }
  }
}
