import { Injectable } from '@angular/core';
import { DbEventService, MessageEventService } from 'src/app/library/public-api';

@Injectable({
  providedIn: 'root'
})
export class TemporaryFileService {
  files: any = [];
  data: any = [];
  chapters: any = [];
  menu:any=[];
  constructor(public MessageEvent: MessageEventService,
    public DbEvent: DbEventService
  ) {
    // MessageEvent.service_worker_register('temporary_file', async event => {
    //   const id = parseInt(event.data.id);
    //   const obj = this.files.find(x => x.id == id);
    //   const blob = await obj.blob.getFile();
    //   return { id: event.data.id, type: "temporary_file", blob: blob }
    // })]
    DbEvent.register('temporary_file', {
      List: async (obj: any) => {
        let list = [];
        list = this.data.map((x: any) => {
          return { id: x.id, cover: `${location.origin}/temporary_file_image/image/${x.comics.chapters[0].pages[0].id}`, title: x.comics.title, subTitle: `${x.comics.chapters[0].title}` }
        });
        return list
      },
      Detail: async (id: string) => {
        const obj = this.data.find((x: { id: string; }) => x.id == id)
        console.log(obj);

        return {
          id: obj.id,
          cover: `${location.origin}/temporary_file_image/image/${obj.comics.chapters[0].pages[0].id}`,
          title: obj.comics.chapters[0].title,
          author: "",
          intro: "",
          chapters: obj.comics.chapters.map((x: {
            title: any;
            id: any; pages: {
              id: any; name: any;
            }[];
          }) => ({
            id: x.id,
            cover: `${location.origin}/temporary_file_image/image/${x.pages[0].id}`,
            title: x.title,
            read: 0,
            selected: false,
            is_locked: false

          })),
          chapter_id:obj.comics.chapters[0].id
        }
      },
      Pages: async (id: string) => {
        const obj1: any = this.chapters.find((x: { id: string; }) => x.id == id);
        console.log(obj1);
        let data = [];
        for (let index = 0; index < obj1.pages.length; index++) {
          const x = obj1.pages[index];
          let obj = {
            id: "",
            src: "",
            small: "",
            width: 0,
            height: 0
          };
          obj["id"] = `${id}_${index}`;
          obj["src"] = `${location.origin}/temporary_file_image/image/${x.id}`,
            obj["small"] = `${location.origin}/temporary_file_image/image/${x.id}`,
            obj["width"] = 0;
          obj["height"] = 0;
          data.push(obj)
        }
        return data
      },
      Image: async (id: string) => {
        const obj = this.files.find((x: { id: string; }) => x.id == id);
        const blob = await obj.blob.getFile();
        return blob
      }
    }, {
      name: "bilibili",
      tab: {
        url: "https://manga.bilibili.com/",
        host_names: ["manga.bilibili.com", "i0.hdslb.com", "manga.hdslb.com"],
      },
      is_edit: false,
      is_locked: true,
      is_cache: true,
      is_tab: true
    });
  }
  init() {
  }

}
