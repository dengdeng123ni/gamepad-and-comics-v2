import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { firstValueFrom } from 'rxjs';
import { AppDataService, DbControllerService, DbEventService } from 'src/app/library/public-api';

@Injectable({
  providedIn: 'root'
})
export class LocalCachService {

  constructor(
    public DbController: DbControllerService,
    public AppData: AppDataService,
    public webDb: NgxIndexedDBService,
    public DbEvent: DbEventService
  ) {

    DbEvent.register({
      name: "local_cache",
      tab: {
        url: "https://manga.bilibili.com/",
        host_names: ["manga.bilibili.com", "i0.hdslb.com", "manga.hdslb.com"],
      },
      is_edit: true,
      is_locked: false,
      is_cache: true,
      is_tab: false
    }, {
      List: async (obj: any) => {
        const res = await firstValueFrom(this.webDb.getAll("local_comics"))
        const list = res.map((x: any) => {
          return { id: x.id, cover: x.cover, title: x.title, subTitle: `${x.chapters[0].title}` }
        }).slice((obj.page_num - 1) * obj.page_size, obj.page_size);

        return list
      },
      Detail: async (id: string) => {
        const res = await firstValueFrom(this.webDb.getAll("local_comics"))
        return res.filter(x=>id==id)[0]
      },
      Pages: async (id: string) => {
        // const obj1: any = this.chapters.find((x: { id: string; }) => x.id == id);
        // let data = [];
        // for (let index = 0; index < obj1.pages.length; index++) {
        //   const x = obj1.pages[index];
        //   let obj = {
        //     id: "",
        //     src: "",
        //     small: "",
        //     width: 0,
        //     height: 0
        //   };
        //   obj["id"] = `${id}_${index}`;
        //   obj["src"] = `${location.origin}/temporary_file_image/image/${x.id}`,
        //   obj["small"] = `${location.origin}/temporary_file_image/image/${x.id}`,
        //   obj["width"] = 0;
        //   obj["height"] = 0;
        //   data.push(obj)
        // }
        // return data
      },
      Image: async (id: string) => {
        // const obj = this.files.find((x: { id: string; }) => x.id == id);
        // const blob = await obj.blob.getFile();
        // return blob
      }
    });
  }

  async save(id: string) {
    const res = await this.DbController.getDetail(id);
    res.origin = this.AppData.origin;
    await firstValueFrom(this.webDb.update("local_comics", res))
  }
}
