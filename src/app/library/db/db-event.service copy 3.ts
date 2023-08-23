import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

interface Events {
  List: Function;
  Detail: Function;
  Pages: Function;
  Image: Function
}
interface Config {
  name: string,
  tab: Tab,
  is_edit: Boolean;
  is_locked: Boolean;
  is_cache: Boolean;
  is_tab: Boolean;
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
          return { id: x.comic_id, cover: httpUrlToHttps(x.vcover), title: x.title, subTitle: `看到 ${x.last_ep_short_title} 话 / 共 ${x.latest_ep_short_title} 话` }
        });
        return list
      },
      Detail: async (id: string) => {
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
      Pages: async (id: string) => {
        const res = await fetch("https://manga.bilibili.com/twirp/comic.v1.Comic/GetImageIndex?device=pc&platform=web", {
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
            width: 0,
            height: 0
          };
          const getImageUrl = async (id: string) => {
            const res = await fetch("https://manga.bilibili.com/twirp/comic.v1.Comic/ImageToken?device=pc&platform=web", {
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
          const utf8_to_b64 = (str: string) => {
            return window.btoa(encodeURIComponent(str));
          }
          obj["id"] = `${id}_${index}`;
          obj["src"] = `${window.location.origin}/image/bilibili/${id}_${index}/${utf8_to_b64(x.path)}`
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
          const res = await fetch("https://manga.bilibili.com/twirp/comic.v1.Comic/ImageToken?device=pc&platform=web", {
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
        const readStreamToString = async (stream: any) => {
          const reader = stream.getReader();
          let result = [];
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            result.push(Array.from(value));
          }
          return result;
        }
        const url = await getImageUrl(_id);
        const rsponse = await fetch(url);
        const data = await readStreamToString(rsponse.body)
        let headers: any = [];
        rsponse.headers.forEach(function (value, name) { headers.push({ value, name }) });
        return { body: data, init: { bodyUsed: rsponse.bodyUsed, headers: headers, ok: rsponse.ok, redirected: rsponse.redirected, status: rsponse.status, statusText: rsponse.statusText, type: rsponse.type, url: rsponse.url } }
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
  async init() {
    let parser = new DOMParser();
    const res = await fetch("https://nhentai.net/g/468956/", {
      "headers": {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "accept-language": "zh-CN,zh;q=0.9",
        "cache-control": "no-cache",
        "pragma": "no-cache",
        "sec-ch-ua": "\"Not/A)Brand\";v=\"99\", \"Google Chrome\";v=\"115\", \"Chromium\";v=\"115\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"macOS\"",
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "same-origin",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1"
      },
      "referrer": "https://nhentai.net/search/?q=%E6%A1%9C%E3%81%AE%E7%81%AF%E3%82%8B%E6%97%A5%E3%81%B8",
      "referrerPolicy": "same-origin",
      "body": null,
      "method": "GET",
      "mode": "cors",
      "credentials": "include"
    });
    const blob = await res.blob();
    var reader = new FileReader();
    reader.readAsText(blob, 'utf-8');
    reader.onload = function (e) {
      const stringContainingHTMLSource = reader.result;
      let doc = parser.parseFromString(stringContainingHTMLSource, "text/html");
     console.log(doc);

    }

  }
  init();
  register = (key: string, events: Events, config: Config) => {
    if (this.Events[key]) this.Events[key] = { ...this.Events[key], ...events };
    else this.Events[key] = events;
    if (this.Events[key]) this.Configs[key] = { ...this.Configs[key], ...config };
    else this.Configs[key] = config;
    let proxy_hostnames: { url: string; host_name: string; }[] = []
    Object.keys(this.Configs).forEach(x => this.Configs[x].tab.host_names.forEach(c => proxy_hostnames.push({ url: this.Configs[x].tab.url, host_name: c })));
    if (navigator.serviceWorker.controller) navigator.serviceWorker.controller.postMessage({ type: "pulg_config", proxy_hostnames: proxy_hostnames, configs: this.Configs })

  }

}