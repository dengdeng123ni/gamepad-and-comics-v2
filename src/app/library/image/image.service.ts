import { Injectable } from '@angular/core';
import { DbControllerService, MessageFetchService } from '../public-api';
import { DomSanitizer } from '@angular/platform-browser';
import { compressAccurately } from 'image-conversion';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  caches!: Cache;
  _data: any = {};
  constructor(public _http: MessageFetchService, public DbController: DbControllerService, private sanitizer: DomSanitizer) {
    this.init();
  }

  async init() {
    this.caches = await caches.open('image');
  }

  async getImage(src: string) {
    const getImageBlobUrl=async (src1)=>{
      const res = await this._http.get(src1);
      const blob = await res.blob();
      const request = new Request(src1);
      const response = new Response(blob);
      await this.caches.put(request, response);
      const res2 = await caches.match(src1);
      if (res2) {
        const blob2 = await res2.blob()
        return this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob2));
      } else {
        return  this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
      }

    }
    let url;
    const id = this.utf8_to_b64(src);
    if (this._data[id]) {
      url = this._data[id]
      return url
    }
    const res = await caches.match(src);
    if (res) {
      const blob = await res.blob()
      if (blob.size == 0) {
        url = await getImageBlobUrl(src)
      }else{
        url = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
      }
    } else {
      url = await getImageBlobUrl(src)
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
  delBlobUrl(src: string, url: string) {
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
    const res = await caches.match(src);
    if (res) {
      const blob = await res.blob()
      return blob
    } else {
      const blob = await this.DbController.getImage(_id)
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
    if (!src) return ""
    if (src.substring(0, 1) !== "h") {
      return src
    }
    let blob: any;
    if (src.includes("temporary_file_image")) {
      return await this.getTemporary_file_image(src) as string;
    } else {
      blob = await this.getLocalImageBlob(src);
    }
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

  async getLocalSmallBlobUrl(src: string) {
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
    if (res) {
      const blob = await res.blob()
      url = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
    } else {
      const blob = await this.DbController.getImage(_id)
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

  async getTemporary_file_image(src: any) {
    let str = src.split("/");
    const _id = str.pop()!;
    const blob = await this.DbController.getImage(_id)
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
}
