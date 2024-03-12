import { Injectable } from '@angular/core';
import { DbControllerService, MessageFetchService } from '../public-api';
import { DomSanitizer } from '@angular/platform-browser';
import { compressAccurately } from 'image-conversion';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  _data: any = {};
  constructor(public _http: MessageFetchService, public DbController: DbControllerService, private sanitizer: DomSanitizer) {

  }



  private async getImageBlobUrl(src: string) {
    let url;
    const id = this.utf8_to_b64(src);
    if (this._data[id]) {
      url = this._data[id]
      return url
    }
    const blob = await this.getImageBlob(src);
    url = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
    this._data[id] = url;
    // setTimeout(()=>{
    //   URL.revokeObjectURL(this._data[id])
    //   this._data[id] = undefined;
    // },10000)
    return url
  }

  private utf8_to_b64 = (str: string) => {
    return window.btoa(encodeURIComponent(str));
  }
  private b64_to_utf8 = (str: string) => {
    return decodeURIComponent(window.atob(str));
  }
  delBlobUrl(src: string, url: string) {
    URL.revokeObjectURL(url);
    const id = this.utf8_to_b64(src);
    if (this._data[id]) {
      delete this._data[id]
    }
  }



  async getImageBlob(src) {
    if (src.substring(0, 10) == "data:image") {
      return this.base64ToBlob(src)
    }
    const blob = await this.DbController.getImage(src);
    return blob
  }
  base64ToBlob(base64Data) {
    let arr = base64Data.split(','),
      fileType = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      l = bstr.length,
      u8Arr = new Uint8Array(l);

    while (l--) {
      u8Arr[l] = bstr.charCodeAt(l);
    }
    return new Blob([u8Arr], {
      type: fileType
    });
  }
  async getImageBase64(src) {
    console.log(src);

    if (!src) return ""
    if (src.substring(0, 10) == "data:image") {
      return src
    }
    let blob: any;
    blob = await this.getImageBlob(src);
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


  async getImageToLocalUrl(src: string) {
    let url = await this.getImageBase64(src);
    return url
  }

}
