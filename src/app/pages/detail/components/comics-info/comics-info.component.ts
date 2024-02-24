import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CurrentService } from '../../services/current.service';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { ImageService } from 'src/app/library/public-api';
interface Info {
  cover: string,
  title: string,
  author?: string,
  intro?: string
}
@Component({
  selector: 'app-comics-info',
  templateUrl: './comics-info.component.html',
  styleUrls: ['./comics-info.component.scss']
})
export class ComicsInfoComponent {
  info = null;

  constructor(
    public current: CurrentService,
    public data: DataService,
    public router: Router,
    public image: ImageService,
  ) {
    this.info = this.data.comics_info;
    this.init();
  }
  async init() {
    const { width, height } = await this.getCoverImageHW(this.info.cover)
    this.info.width = width;
    this.info.height = height;
  }
  on(e){
    console.log(e);

    window.open(e,'_blank')
  }
  back() {
    this.router.navigate(['/'])
  }
  continue() {
    this.router.navigate(['/', this.data.comics_id, this.data.chapter_id,])
  }


  async getCoverImageHW(src) {
    const utf8_to_b64 = (str: string) => {
      return window.btoa(encodeURIComponent(str));
    }
    const id = utf8_to_b64(src);
    const res = await this.current._getImageHW(id)

    if (res) {
      return { width: res.width, height: res.height }
    } else {
      const url = await this.image.getImageToLocalUrl(src);
      const loadImage = async (url: string) => {
        return await  await createImageBitmap(await fetch(url).then((r) => r.blob()))
      }
      const img = await loadImage(url.changingThisBreaksApplicationSecurity);
      this.current._setImageHW(id, { width: img.width, height: img.height })
      return { width: img.width, height: img.height }
    }

  }


}
