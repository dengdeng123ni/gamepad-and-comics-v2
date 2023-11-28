import { Injectable } from '@angular/core';
import { MessageFetchService } from '../public-api';
import { DomSanitizer } from '@angular/platform-browser';
import { compressAccurately } from 'image-conversion';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  caches!: Cache;
  _data: any = {};
  constructor(public _http: MessageFetchService, private sanitizer: DomSanitizer,) {
    this.init();
  }

  async init() {
    this.caches = await caches.open('image');
  }

  async getImage(src: string) {
    let url;
    const id = this.utf8_to_b64(src);
    if (this._data[id]) {
      url = this._data[id]
      return url
    }
    const res = await caches.match(src);
    if (res) {
      const blob = await res.blob()
      url = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
    } else {
      const res = await this._http.get(src);
      const blob = await res.blob();
      const request = new Request(src);
      const response = new Response(blob);
      await this.caches.put(request, response);
      const res2 = await caches.match(src);
      if (res2) {
        const blob2 = await res2.blob()
        url = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob2));
      } else {
        url = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
      }
    }
    this._data[id] = url;
    return url
  }
  utf8_to_b64 = (str: string) => {
    return window.btoa(encodeURIComponent(str));
  }
  b64_to_utf8 = (str: string) => {
    return decodeURIComponent(window.atob(str));
  }
  delBlobUrl(src:string,url:string){
    URL.revokeObjectURL(url);
    const id = this.utf8_to_b64(src);
    if (this._data[id]) {
      delete this._data[id]
    }
  }
  async getLocalImageBlob(src: string): Promise<Blob> {
    if (!src) return new Blob([])
    let str = src.split("/");
    const _id = str.pop()!;
    src = str.join("/");
    const id = this.utf8_to_b64(src);
    const res = await caches.match(src);
    if (res) {
      const blob = await res.blob()
      return blob
    } else {
      const res = await this.getId(_id)
      const blob = await res.blob();
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
  }
  async getLocalImagebase64(src: string): Promise<string> {
    if(src.substring(0,1)!=="h"){
       return src
    }
    const blob = await this.getLocalImageBlob(src);

    return new Promise((r, j) => {
      var reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = () => {
        r(reader.result as string)
      };
      reader.onerror = () => {
        j("")
      }
    })
  }

  async getLocalSmallBlobUrl(src: string){
    let url;
    let str = src.split("/");
    const _id = str.pop()!;
    src = str.join("/");
    const id = this.utf8_to_b64(src);
    const res = await caches.match(src);
    // if (this._data[id]) {
    //   url = this._data[id]
    //   return url
    // }
    console.log(res);

    if (res) {
      const blob = await res.blob()
      url = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
    } else {
      const res = await this.getId(_id)
      const blob = await res.blob();
      const thumbnailBlob = await compressAccurately(blob, { size: 50, accuracy: 0.9, width: 200, orientation: 1, scale: 0.5, })
      const response = new Response(thumbnailBlob);
      const request = new Request(src);
      await this.caches.put(request, response);
      const res2 = await caches.match(src);
      if (res2) {
        const blob2 = await res2.blob()
        url = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob2));
      } else {
        url = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
      }
    }
    return url
  }
  async getId(id: string) {
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
    return res
  }
}
