import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageFetchService } from '../public-api';
interface Events {
  List: Function;
  Detail: Function;
  Pages: Function;
  Image: Function;
}
interface Config {
  name: string,
  tab: Tab,
  is_edit: boolean;
  is_locked: boolean;
  is_cache: boolean;
  is_offprint: boolean;
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
  constructor(
    public http: HttpClient,
    public _http: MessageFetchService,
  ) {
    setTimeout(() => {
      // console.log(this.Configs);
      // http://localhost:7700/名称/comics_cover/漫画ID/图片信息
      // http://localhost:7700/名称/chapter_cover/章节ID/图片信息
      // http://localhost:7700/名称/page/页面ID/图片信息
    }, 3000)
    this.register({
      name: "bilibili",
      tab: {
        url: "https://manga.bilibili.com/",
        host_names: ["manga.bilibili.com", "i0.hdslb.com", "manga.hdslb.com"],
      },
      is_edit: false,
      is_locked: true,
      is_cache: true,
      is_offprint: false,
      is_tab: true
    }, {
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
          href:`https://manga.bilibili.com/detail/mc${x.id}`,
          cover: httpUrlToHttps(x.vertical_cover),
          title: x.title,
          author: x.author_name.toString(),
          intro: x.classic_lines,
          styles: x.styles2.map(x=>(
            {
              ...x,
              href:`https://manga.bilibili.com/classify?from=manga_detail&styles=${x.id}&areas=-1&status=-1&prices=-1&orders=0`
            }
          )),
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
            width: 0,
            height: 0
          };
          const utf8_to_b64 = (str: string) => {
            return window.btoa(encodeURIComponent(str));
          }
          obj["id"] = `${id}_${index}`;
          obj["src"] = x.path;
          obj["width"] = x.x;
          obj["height"] = x.y;
          data.push(obj)
        }
        return data
      },
      Image: async (id: string) => {
        if (id.substring(0,4)=="http") {
          const res = await this._http.get_background(id)
          const blob = await res.blob();
          return blob
        }else{
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
          const url = await getImageUrl(id);
          const res = await this._http.get(url);
          const blob = await res.blob();
          return blob
        }
      }
    });
    this.register({
      name: "hanime1",
      tab: {
        url: "https://hanime1.me/comic/",
        host_names: ["hanime1.me"],
      },
      is_edit: false,
      is_locked: false,
      is_cache: true,
      is_offprint: true,
      is_tab: true
    }, {
      List: async (obj: any) => {
        let list = [];
        return list
      },
      Detail: async (id: string) => {
        const res = await this._http.fetch_html(`https://hanime1.me/comic/${id}`, {
          "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
            "content-type": "application/json;charset=UTF-8"
          },
          "body": null,
          "method": "GET"
        });
        const text = await res.text();
        var parser = new DOMParser();
        var doc: any = parser.parseFromString(text, 'text/html');
        let obj = {
          id: id,
          cover: "",
          title: "",
          author: "",
          author_href: "",
          intro: "",
          chapters: [

          ],
          chapter_id: id,
          styles: []
        }
        const utf8_to_b64 = (str: string) => {
          return window.btoa(encodeURIComponent(str));
        }
        obj.title = doc.querySelector("body > div > div:nth-child(4) > div:nth-child(2) > div > div.col-md-8 > h3").textContent.trim()
        obj.cover = doc.querySelector("body > div > div:nth-child(4) > div:nth-child(2) > div > div.col-md-4 > a > img").src;
        const nodes = doc.querySelectorAll("h5:nth-child(1) .hover-lighter .no-select");
        const nodes1 = doc.querySelectorAll("h5:nth-child(2) .hover-lighter .no-select");
        const nodes2 = doc.querySelectorAll("h5:nth-child(3) .hover-lighter .no-select");
        let styles = []

        if (nodes1.length > nodes.length) {
          for (let index = 0; index < nodes1.length; index++) {
            obj.styles.push({ name: nodes1[index].textContent, href: nodes1[index].parentNode.href })
          }
          obj.author = nodes2[0].textContent;
          obj.author_href = nodes2[0].parentNode.href
        } else {
          for (let index = 0; index < nodes.length; index++) {
            obj.styles.push({ name: nodes[index].textContent, href: nodes1[index]?.parentNode?.href })
          }
          obj.author = nodes1[0].textContent;
          obj.author_href = nodes1[0].parentNode.href
        }

        obj.chapters.push({
          id: obj.id,
          title: obj.title,
          cover: obj.cover,
        })
        return obj
      },
      Pages: async (id: string) => {
        const res = await this._http.fetch_html(`https://hanime1.me/comic/${id}`, {
          "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
            "content-type": "application/json;charset=UTF-8"
          },
          "body": null,
          "method": "GET"
        });
        const text = await res.text();
        var parser = new DOMParser();
        var doc: any = parser.parseFromString(text, 'text/html');

        let data = [];
        let nodes = doc.querySelectorAll(".comics-thumbnail-wrapper img")
        for (let index = 0; index < nodes.length; index++) {
          let _id = nodes[index].dataset.srcset.split("/").at(-2)
          let type = nodes[index].dataset.srcset.split("/").at(-1).split(".").at(-1)
          let obj = {
            id: "",
            src: "",
            width: 0,
            height: 0
          };
          const utf8_to_b64 = (str: string) => {
            return window.btoa(encodeURIComponent(str));
          }

          obj["id"] = `${id}_${index}`;
          obj["src"] = `https://i.nhentai.net/galleries/${_id}/${index + 1}.${type}`
          data.push(obj)
        }
        return data
      },
      Image: async (id: string) => {

        const getImageUrl = async (id: string) => {
          const res = await this._http.fetch_background(id, {
            method: "GET",
            headers: {
              "accept": "image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
              "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
              "sec-ch-ua": "\"Microsoft Edge\";v=\"119\", \"Chromium\";v=\"119\", \"Not?A_Brand\";v=\"24\""
            },
            mode: "cors"
          });
          const blob = await res.blob();
          return blob
        }
        const blob = await getImageUrl(id);
        return blob
      }
    });
    this.register({
      name: "ehentai",
      tab: {
        url: "https://hanime1.me/comic/",
        host_names: ["manga.bilibili.com", "i0.hdslb.com", "manga.hdslb.com"],
      },
      is_edit: false,
      is_locked: false,
      is_cache: false,
      is_offprint: false,
      is_tab: true
    }, {
      List: async (obj: any) => {
        let list = [];
        return list
      },
      Detail: async (id: string) => {
        const b64_to_utf8 = (str: string) => {
          return decodeURIComponent(window.atob(str));
        }
        const res = await this._http.fetch_html(b64_to_utf8(id), {
          "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
            "content-type": "application/json;charset=UTF-8"
          },
          "body": null,
          "method": "GET"
        });
        const text = await res.text();
        var parser = new DOMParser();
        var doc: any = parser.parseFromString(text, 'text/html');

        let obj = {
          id: id,
          cover: "",
          title: "",
          author: "",
          intro: "",
          chapters: [

          ],
          chapter_id: id
        }
        const utf8_to_b64 = (str: string) => {
          return window.btoa(encodeURIComponent(str));
        }
        obj.title = doc.querySelector("#gn").textContent.trim()
        obj.cover = `${window.location.origin}/hanime1/` + utf8_to_b64(doc.querySelector("#gd1 > div").style.background.split('"')[1]);
        obj.chapters.push({
          id: obj.id,
          title: obj.title,
          cover: obj.cover,
        })


        return obj
      },
      Pages: async (id: string) => {
        const b64_to_utf8 = (str: string) => {
          return decodeURIComponent(window.atob(str));
        }
        const res = await this._http.fetch_html(b64_to_utf8(id), {
          "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
            "content-type": "application/json;charset=UTF-8"
          },
          "body": null,
          "method": "GET"
        });
        const text = await res.text();
        var parser = new DOMParser();
        var doc: any = parser.parseFromString(text, 'text/html');
        const nodes = doc.querySelectorAll(".ptt a");
        let arr = []
        for (let index = 0; index < nodes.length; index++) {
          const element = nodes[index];
          arr.push(element.href)
        }
        arr.pop()

        let arr2 = [];
        for (let index = 0; index < arr.length; index++) {
          const res = await this._http.fetch_html(arr[index], {
            "headers": {
              "accept": "application/json, text/plain, */*",
              "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
              "content-type": "application/json;charset=UTF-8"
            },
            "body": null,
            "method": "GET"
          });
          const text = await res.text();
          var parser = new DOMParser();
          var doc: any = parser.parseFromString(text, 'text/html');
          const nodes = doc.querySelectorAll(".gdtm a")

          for (let index = 0; index < nodes.length; index++) {
            const element = nodes[index] as any;
            arr2.push(element.href)
          }

        }

        let data = [];
        for (let index = 0; index < arr2.length; index++) {
          let obj = {
            id: "",
            src: "",
            width: 0,
            height: 0
          };
          const utf8_to_b64 = (str: string) => {
            return window.btoa(encodeURIComponent(str));
          }

          obj["id"] = `${id}_${index}`;
          obj["src"] = `${window.location.origin}/hanime1/${id}_${index}/${utf8_to_b64(arr2[index])}`
          data.push(obj)
        }
        return data
      },
      Image: async (id: string) => {
        const b64_to_utf8 = (str: string) => {
          return decodeURIComponent(window.atob(str));
        }
        const _id = b64_to_utf8(id);
        const getHtmlUrl = async (url) => {
          const res = await this._http.fetch_html(url, {
            "headers": {
              "accept": "application/json, text/plain, */*",
              "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
              "content-type": "application/json;charset=UTF-8"
            },
            "body": null,
            "method": "GET"
          });
          const text = await res.text();
          var parser = new DOMParser();
          var doc: any = parser.parseFromString(text, 'text/html');
          return doc.querySelector("#img").src
        }
        const getImageUrl = async (id: string) => {
          const res = await this._http.fetch_background(id, {
            method: "GET",
            headers: {
              "accept": "image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
              "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
              "sec-ch-ua": "\"Microsoft Edge\";v=\"119\", \"Chromium\";v=\"119\", \"Not?A_Brand\";v=\"24\""
            },
            mode: "cors"
          });
          const blob = await res.blob();
          return blob
        }
        const url = await getHtmlUrl(_id)
        const blob = await getImageUrl(url);
        return blob
      }
    });
    window._register = this.register;
  }

  register = (config: Config, events: Events) => {
    const key = config.name;
    if (this.Events[key]) this.Events[key] = { ...this.Events[key], ...events };
    else this.Events[key] = events;
    if (this.Events[key]) this.Configs[key] = { ...this.Configs[key], ...config };
    else this.Configs[key] = config;
    let proxy_hostnames: { url: string; host_name: string; }[] = []
    Object.keys(this.Configs).forEach(x => this.Configs[x].tab.host_names.forEach(c => proxy_hostnames.push({ url: this.Configs[x].tab.url, host_name: c })));
    if (navigator.serviceWorker.controller) navigator.serviceWorker.controller.postMessage({ type: "pulg_config", proxy_hostnames: proxy_hostnames, configs: this.Configs })

  }

}
