import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

interface Events {
  List: Function;
  Detail: Function;
}

@Injectable({
  providedIn: 'root'
})
export class DbEventService {
  public Event: { [key: string]: Events } = {};

  constructor(public http: HttpClient) {
    this.register('bilibili', {
      List: async () => {
        const res = await
        fetch("https://manga.bilibili.com/twirp/bookshelf.v1.Bookshelf/ListFavorite?device=pc&platform=web", {
          "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
            "content-type": "application/json;charset=UTF-8"
          },
          "body": "{\"page_num\":1,\"page_size\":100,\"order\":3,\"wait_free\":0}",
          "method": "POST"
        });
        const json = await res.json();
        const list = json.data.map((x: any) => {
          const httpUrlToHttps = (str: string) => {
            const url = new URL(str);
            if (url.protocol == "http:") {
              return `https://${url.host}${url.pathname}`
            } else {
              return str
            }
          }
          return { id: x.id, cover: httpUrlToHttps(x.vcover), title: x.title, subTitle: `看到 ${x.last_ep_short_title} 话 / 共 ${x.latest_ep_short_title} 话` }
        });
        return list
      },
      Detail: async (id:string) => {
        const res = await fetch("https://manga.bilibili.com/twirp/comic.v1.Comic/ComicDetail?device=pc&platform=web", {
          "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
            "content-type": "application/json;charset=UTF-8"
          },
          "body": `{\"comic_id\":${id}}`,
          "method": "POST"
        });
        const json = await res.json();
        const x = json.data;
        const httpUrlToHttps = (str: string) => {
          const url = new URL(str);
          if (url.protocol == "http:") {
            return `https://${url.host}${url.pathname}`
          } else {
            return str
          }
        }
        return {
          id: x.id,
          cover: httpUrlToHttps(x.vertical_cover),
          title: x.title,
          author: x.author_name.toString(),
          intro: x.classic_lines,
          chapters: x.ep_list.map((c:any) => (
            {
              ...c,
              cover: httpUrlToHttps(c.cover)
            }
          )).reverse()
        }
      }
    })
  }
  register(key: string, events: Events) {
    if (this.Event[key]) this.Event[key] = { ...this.Event[key], ...events };
    else this.Event[key] = events;
  }

}
