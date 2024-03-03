import { Injectable } from '@angular/core';
import { AppDataService } from 'src/app/library/public-api';
import { DbEventService } from './db-event.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { firstValueFrom } from 'rxjs';
interface Item { id: string | number, cover: string, title: string, subTitle: string }
interface Events {
  List: Function;
  Detail: Function;
  Pages: Function;
  Image: Function
}

@Injectable({
  providedIn: 'root'
})
export class DbControllerService {

  lists: any = {};
  details: any = {};
  pages: any = {};

  cache = {
    details: false,
    pages: false
  }

  caches!: Cache;
  constructor(
    private AppData: AppDataService,
    private DbEvent: DbEventService,
    private webDb: NgxIndexedDBService,
  ) {
    this.init();
  }

  async init() {
    this.caches = await caches.open('image');
  }

  async getList(id: string, option?: {
    origin: string
  }): Promise<Array<Item>> {
    if (!option) option = { origin: this.AppData.origin }
    if (!option.origin) option.origin = this.AppData.origin;
    const config = this.DbEvent.Configs[option.origin]
    if (this.DbEvent.Events[option.origin] && this.DbEvent.Events[option.origin]["List"]) {
      if (this.lists[id]) {
        return JSON.parse(JSON.stringify(this.lists[id]))
      } else {
        const b64_to_utf8 = (str: string) => {
          return JSON.parse(decodeURIComponent(escape(window.atob(str))));
        }
        const obj = b64_to_utf8(id)
        let res = await this.DbEvent.Events[option.origin]["List"](obj);
        const utf8_to_b64 = (str: string) => {
          return window.btoa(encodeURIComponent(str));
        }
        res.forEach(x => {
          x.cover = `http://localhost:7700/${config.name}/comics_cover/${x.id}/${utf8_to_b64(x.cover)}`;
        })
        this.lists[id] = JSON.parse(JSON.stringify(res));
        return res
      }
    } else {
      return []
    }
  }
  async getDetail(id: string, option?: {
    origin: string
  }) {
    if (!option) option = { origin: this.AppData.origin }
    if (!option.origin) option.origin = this.AppData.origin;
    const config = this.DbEvent.Configs[option.origin]
    if (this.DbEvent.Events[option.origin] && this.DbEvent.Events[option.origin]["Detail"]) {
      if (this.details[id]) {
        return JSON.parse(JSON.stringify(this.details[id]))
      } else {
        if (config.is_cache) {
          let res:any = await firstValueFrom(this.webDb.getByID('details', id))
          if (res) {
            this.details[id] = JSON.parse(JSON.stringify(res));
            res.option = { origin: option.origin, is_offprint: config.is_offprint }
            return res
          }
        }
        let res = await this.DbEvent.Events[option.origin]["Detail"](id);
        if (config.is_cache) {
          const utf8_to_b64 = (str: string) => {
            return window.btoa(encodeURIComponent(str));
          }
          res.cover = `http://localhost:7700/${config.name}/comics_cover/${res.id}/${utf8_to_b64(res.cover)}`;
          res.chapters.forEach(x => {
            x.cover = `http://localhost:7700/${config.name}/chapter_cover/${res.id}/${x.id}/${utf8_to_b64(x.cover)}`;
          })
          res.option = { origin: option.origin, is_offprint: config.is_offprint };
          firstValueFrom(this.webDb.update('details', res))
        }
        if (!Array.isArray(res.author)) {
          res.author = [{ name: res.author }]
        }
        console.log(213);

        this.details[id] = JSON.parse(JSON.stringify(res));
        console.log(res);

        return res
      }
    } else {
      return []
    }
  }
  async getPages(id: string, option?: {
    origin: string
  }) {
    if (!option) option = { origin: this.AppData.origin }
    if (!option.origin) option.origin = this.AppData.origin;
    const config = this.DbEvent.Configs[option.origin]

    if (this.DbEvent.Events[option.origin] && this.DbEvent.Events[option.origin]["Pages"]) {
      if (this.pages[id]) {
        return JSON.parse(JSON.stringify(this.pages[id]))
      } else {
        if (config.is_cache) {
          let res = (await firstValueFrom(this.webDb.getByID('pages', id)) as any)
          if (res) {
            this.pages[id] = JSON.parse(JSON.stringify(res.data));
            return res.data
          }
        }
        let res = await this.DbEvent.Events[option.origin]["Pages"](id);
        if (config.is_cache) {
          const utf8_to_b64 = (str: string) => {
            return window.btoa(encodeURIComponent(str));
          }
          res.forEach((x, i) => {
            x.src = `http://localhost:7700/${config.name}/page/${id}/${i}/${utf8_to_b64(x.src)}`;
          })
          firstValueFrom(this.webDb.update('pages', { id: id, data: res }))
        }
        this.pages[id] = JSON.parse(JSON.stringify(res));
        return res
      }
    } else {
      return []
    }
  }
  async getImage(id: string, option?: {
    origin: string
  }) {
    if (!option) option = { origin: this.AppData.origin }
    if (!option.origin) option.origin = this.AppData.origin;
    const config = this.DbEvent.Configs[option.origin]
    console.log(id);

    if (this.DbEvent.Events[option.origin] && this.DbEvent.Events[option.origin]["Image"]) {
      if (id.substring(7, 21) == "localhost:7700") {
        let url = id;
        let str = url.split("/");
        const _id = str.pop()!;
        const src = str.join("/");
        const getBlob = async () => {
          const b64_to_utf8 = (str: string) => {
            return decodeURIComponent(window.atob(str));
          }
          const id1 = b64_to_utf8(_id);
          const blob = await this.DbEvent.Events[option.origin]["Image"](id1)
          const response = new Response(blob);
          const request = new Request(src);
          await this.caches.put(request, response);
          const res2 = await caches.match(src);
          if (res2) {
            const blob2 = await res2.blob()
            return blob2
          } else {
            return blob
          }
        }
        const res = await caches.match(src);
        if (res) {
          const blob = await res.blob()
          if (blob.size < 1000) {
            return await getBlob()
          }
          return blob
        } else {
          return await getBlob()
        }
      } else {
        const res = await this.DbEvent.Events[option.origin]["Image"](id)
        return res
      }
    } else {
      return new Blob([], {
        type: 'image/jpeg'
      })
    }
  }
}
