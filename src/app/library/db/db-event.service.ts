import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageFetchService } from '../public-api';
interface Events {
  List: Function;
  Detail: Function;
  Pages: Function;
  Image: Function
  Unlock?: Function
}
interface Config {
  name: string,
  tab: Tab,
  is_edit: boolean;
  is_locked: boolean;
  is_cache: boolean;
  is_tab: boolean;
}
interface Tab {
  url: string,
  host_names: Array<string>,
}
declare let window: any;

@Injectable({
  providedIn: 'root'
})
export class DbEventService {
  public Events: { [key: string]: Events } = {};
  public Configs: { [key: string]: Config } = {};
  constructor(public http: HttpClient,
    public _http: MessageFetchService,
  ) {
    this.register({
      name: "bilibili",
      tab: {
        url: "https://manga.bilibili.com/",
        host_names: ["manga.bilibili.com", "i0.hdslb.com", "manga.hdslb.com"],
      },
      is_edit: false,
      is_locked: true,
      is_cache: true,
      is_tab: true
    },{
      List: async (obj: any) => {
        let list = [];
        if (obj.query_type == "type") {
          const res = await
            this._http.fetch("https://manga.bilibili.com/twirp/comic.v1.Comic/ClassPage?device=pc&platform=web", {
              "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                "content-type": "application/json;charset=UTF-8"
              },
              "body": JSON.stringify(obj),
              "method": "POST"
            });
          const json = await res.json();
          list = json.data.map((x: any) => {
            const httpUrlToHttps = (str: string) => {
              const url = new URL(str);
              if (url.protocol == "http:") {
                return `https://${url.host}${url.pathname}`
              } else {
                return str
              }
            }
            return { id: x.season_id, cover: httpUrlToHttps(x.vertical_cover), title: x.title, subTitle: x.bottom_info }
          });
        } else if (obj.query_type == "favorites") {
          const res = await
            this._http.fetch("https://manga.bilibili.com/twirp/bookshelf.v1.Bookshelf/ListFavorite?device=pc&platform=web", {
              "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                "content-type": "application/json;charset=UTF-8"
              },
              "body": `{\"page_num\":${obj.page_num},\"page_size\":${obj.page_size},\"order\":${obj.order},\"wait_free\":${obj.wait_free}}`,
              "method": "POST"
            });
          const json = await res.json();
          const httpUrlToHttps = (str: string) => {
            const url = new URL(str);
            if (url.protocol == "http:") {
              return `https://${url.host}${url.pathname}`
            } else {
              return str
            }
          }
          list = json.data.map((x: any) => {
            return { id: x.comic_id, cover: httpUrlToHttps(x.vcover), title: x.title, subTitle: `看到 ${x.last_ep_short_title} 话 / 共 ${x.latest_ep_short_title} 话` }
          });
        } else if (obj.query_type == "update") {
          const res = await this._http.fetch("https://manga.bilibili.com/twirp/comic.v1.Comic/GetDailyPush?device=pc&platform=web", {
            "headers": {
              "accept": "application/json, text/plain, */*",
              "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
              "content-type": "application/json;charset=UTF-8"
            },
            "body": `{\"date\":\"${obj.date}\",\"page_num\":1,\"page_size\":50}`,
            "method": "POST"
          });
          const json = await res.json();
          const httpUrlToHttps = (str: string) => {
            const url = new URL(str);
            if (url.protocol == "http:") {
              return `https://${url.host}${url.pathname}`
            } else {
              return str
            }
          }
          list = json.data.list.map((x: any) => {
            return { id: x.comic_id, cover: httpUrlToHttps(x.vertical_cover), title: x.title, subTitle: `更新 ${x.short_title} 话` }
          });

        } else if (obj.query_type == "ranking") {
          const res = await this._http.fetch("https://manga.bilibili.com/twirp/comic.v1.Comic/GetRankInfo?device=pc&platform=web", {
            "headers": {
              "accept": "application/json, text/plain, */*",
              "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
              "content-type": "application/json;charset=UTF-8"
            },
            "body": `{\"id\":${obj.id}}`,
            "method": "POST"
          });
          const json = await res.json();
          const httpUrlToHttps = (str: string) => {
            const url = new URL(str);
            if (url.protocol == "http:") {
              return `https://${url.host}${url.pathname}`
            } else {
              return str
            }
          }
          list = json.data.list.map((x: any) => {
            return { id: x.comic_id, cover: httpUrlToHttps(x.vertical_cover), title: x.title, subTitle: `更新 ${x.total} 话` }
          });
        } else if (obj.query_type == "home") {
          const res = await this._http.fetch("https://manga.bilibili.com/twirp/comic.v1.Comic/GetClassPageSixComics?device=pc&platform=web", {
            "headers": {
              "accept": "application/json, text/plain, */*",
              "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
              "content-type": "application/json;charset=UTF-8"
            },
            "body": `{\"id\":${obj.id},\"isAll\":0,\"page_num\":${obj.page_num},\"page_size\":${obj.page_size}}`,
            "method": "POST"
          });
          const json = await res.json();
          const httpUrlToHttps = (str: string) => {
            const url = new URL(str);
            if (url.protocol == "http:") {
              return `https://${url.host}${url.pathname}`
            } else {
              return str
            }
          }
          list = json.data.roll_six_comics.map((x: any) => {
            return { id: x.comic_id, cover: httpUrlToHttps(x.vertical_cover), title: x.title, subTitle: `${x.recommendation}` }
          });
        }
        return list
      },
      Detail: async (id: string) => {
        const res = await this._http.fetch("https://manga.bilibili.com/twirp/comic.v1.Comic/ComicDetail?device=pc&platform=web", {
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
          chapters: x.ep_list.map((c: any) => (
            {
              ...c,
              cover: httpUrlToHttps(c.cover),
              title: `${c.short_title} ${c.title}`
            }
          )).reverse(),
          chapter_id: x.read_epid
        }
      },
      Unlock: async (id: string) => {

      },
      Pages: async (id: string) => {
        const res = await this._http.fetch("https://manga.bilibili.com/twirp/comic.v1.Comic/GetImageIndex?device=pc&platform=web", {
          "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
            "content-type": "application/json;charset=UTF-8"
          },
          "body": `{\"ep_id\":${id}}`,
          "method": "POST"
        });
        const json = await res.json();
        let data = [];
        for (let index = 0; index < json.data.images.length; index++) {
          let x = json.data.images[index];
          let obj = {
            id: "",
            src: "",
            small: "",
            width: 0,
            height: 0
          };
          const utf8_to_b64 = (str: string) => {
            return window.btoa(encodeURIComponent(str));
          }

          obj["id"] = `${id}_${index}`;
          obj["src"] = `${window.location.origin}/bilibili/image/${id}_${index}/${utf8_to_b64(x.path)}`
          obj["small"] = `${window.location.origin}/bilibili/small/${id}_${index}/${utf8_to_b64(x.path)}`
          obj["width"] = x.x;
          obj["height"] = x.y;
          data.push(obj)
        }
        return data
      },
      Image: async (id: string) => {
        const b64_to_utf8 = (str: string) => {
          return decodeURIComponent(window.atob(str));
        }
        const _id = b64_to_utf8(id);

        const getImageUrl = async (id: string) => {
          const res = await this._http.fetch("https://manga.bilibili.com/twirp/comic.v1.Comic/ImageToken?device=pc&platform=web", {
            "headers": {
              "accept": "application/json, text/plain, */*",
              "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
              "content-type": "application/json;charset=UTF-8"
            },
            "body": `{\"urls\":\"[\\\"${id}\\\"]\"}`,
            "method": "POST",
          });
          const json = await res.json();
          return `${json.data[0].url}?token=${json.data[0].token}`
        }
        const url = await getImageUrl(_id);
        const res = await this._http.get(url);
        const blob = await res.blob();
        return blob
      }
    });
    window._register = this.register;
  }

  register = ( config: Config,events: Events) => {
    const key=config.name;
    if (this.Events[key]) this.Events[key] = { ...this.Events[key], ...events };
    else this.Events[key] = events;
    if (this.Events[key]) this.Configs[key] = { ...this.Configs[key], ...config };
    else this.Configs[key] = config;
    let proxy_hostnames: { url: string; host_name: string; }[] = []
    Object.keys(this.Configs).forEach(x => this.Configs[x].tab.host_names.forEach(c => proxy_hostnames.push({ url: this.Configs[x].tab.url, host_name: c })));
    if (navigator.serviceWorker.controller) navigator.serviceWorker.controller.postMessage({ type: "pulg_config", proxy_hostnames: proxy_hostnames, configs: this.Configs })

  }

}
