import { Component, HostListener, ViewChild } from '@angular/core';
import { async, forkJoin, Observable } from 'rxjs';
import SwiperCore, {
  Navigation,
  Pagination,
  Mousewheel,
  Keyboard,
  Autoplay,
  Manipulation,
  SwiperOptions,
  Swiper
} from "swiper";
import { SwiperComponent } from 'swiper/angular';
import { CurrentService } from '../../services/current.service';
import { DataService } from '../../services/data.service';
import { PagesItem } from 'src/app/library/public-api';
SwiperCore.use([Manipulation, Navigation, Pagination, Mousewheel, Keyboard, Autoplay]);
@Component({
  selector: 'app-double-page-reader',
  templateUrl: './double-page-reader.component.html',
  styleUrls: ['./double-page-reader.component.scss']
})


export class DoublePageReaderComponent {
  @ViewChild('swiper', { static: false }) swiper!: SwiperComponent;

  @HostListener('window:keydown', ['$event'])
  handleKeyDown = (event: KeyboardEvent) => {
    if (event.key == "c") this.pageToggle();
    if (event.key == "v") this.firstPageToggle();
  }
  @HostListener('window:keyup', ['$event'])
  handleKeyUp = (event: KeyboardEvent) => {
  }
  list: Array<PagesItem> = [];

  index = 0;

  steps = 1;

  isSwitch = false;

  isPageFirst = true;
  isFirst = false;
  is_first_page_cover = false;

  change$;
  event$;

  is_init = false;


  constructor(
    public current: CurrentService,
    public data: DataService
  ) {

    this.list = this.data.pages as any;
    this.change(this.data.page_index)

    this.change$ = this.current.change().subscribe(x => {
      if (x.type == "changePage") {
        this.change(x.page_index);
      } else if (x.type == "changeChapter") {
        this.list = x.pages;
        this.change(x.page_index);
        this.isPageFirst = true;
        this.isSwitch = false;
      } else if (x.type == "nextPage") {
        this.next()
      } else if (x.type == "previousPage") {
        this.previous()
      }
    })
    this.event$ = this.current.event().subscribe(x => {
      if (x.key == "double_page_reader_FirstPageToggle") {
        this.firstPageToggle();
      } else if (x.key == "double_page_reader_togglePage") {
        this.pageToggle();
      }
    })


  }

  ngOnDestroy() {
    this.change$.unsubscribe();
    this.event$.unsubscribe();
  }

  firstPageToggle() {
    this.is_first_page_cover = !this.is_first_page_cover;
    if (this.index == 0) {
      this.pageToggle();
      this.pageToggle();
    } else {

    }
  }

  pageToggle() {
    if (this.index == 0) {
      this.current._pageChange(this.index);
    } else {
      if (this.index == this.list.length - 1) {
        this.current._pageChange(this.isSwitch ? this.index - 1 : this.index - 1);
        // this.isSwitch = !this.isSwitch;
      } else {
        this.current._pageChange(this.isSwitch ? this.index - 1 : this.index + 1);
      }
    }
    this.isSwitch = !this.isSwitch;
  }


  slidePrevTransitionEnd(swiper: Array<Swiper>) {
    if (this.isMobile) {
      this.data.comics_config.is_page_direction ? this.previous() : this.next();
    } else {
      if (!this.isWaitPrevious) {
        this.isWaitPrevious = true;
        setTimeout(() => {
          this.data.comics_config.is_page_direction ? this.previous() : this.next();
          this.isWaitPrevious = false;
        }, 400)
      }
    }

  }
  slideNextTransitionEnd(swiper: Array<Swiper>) {
    if (this.isMobile) {
      this.data.comics_config.is_page_direction ? this.next() : this.previous();
    } else {
      if (!this.isWaitNext) {
        this.isWaitNext = true;
        setTimeout(() => {
          this.data.comics_config.is_page_direction ? this.next() : this.previous();
          this.isWaitNext = false;
        }, 400)
      }
    }
  }
  isWaitPrevious = false;
  isWaitNext = false;
  isMobile = false;

  swiperConfig: SwiperOptions = {
    mousewheel: {
      thresholdDelta: 50,
      forceToAxis: false,
      thresholdTime: 1000,
    },
    direction: "vertical",
    scrollbar: { draggable: true },
  };

  slideChange($event: Array<Swiper>) {

  }
  async next() {
    const nodes = document.querySelectorAll(`[currentimage]`);
    const index = this.index + nodes.length;

    if (index >= this.list.length) {
      this.list = await this.current._setNextChapter();
      this.isPageFirst = true;
      this.isSwitch = false;
      this.current._pageChange(0)
      return
    }
    this.current._pageChange(index);
  }
  async previous() {
    let list = this.list;
    let index = this.index;

    if (index >= 2) {
      let a = await this.loadImage(list[index - 1].src);
      let c = await this.loadImage(list[index - 2].src);
      if (a.width < a.height && c.width < c.height) {
        this.steps = 2;
      } else {
        this.steps = 1;
        this.isFirst = true;
      }
    } else {
      this.steps = 1;
    }
    if ((index - 1) < 0) {
      this.list = await this.current._setPreviousChapter();
      this.isPageFirst = true;
      this.isSwitch = false;
      this.current._pageChange(this.list.length - 1)
      return
    }


    index = index - this.steps;
    this.current._pageChange(index);
  }
  async change(index: number) {
    if (Number.isNaN(index)) index = 0;
    this.index = index;
    if (this.index < 0) this.index = 0;
    if(this.isPageFirst&&this.index==0) this.is_first_page_cover = await this.current._getChapter_IsFirstPageCover(this.data.chapter_id);
    const res: any = await this.getCurrentImages(this.list, this.index);
    if (!res.previous.primary.image.src && !res.previous.secondary.image.src) res.previous = await this.getPreviousLast();
    if (!res.next.primary.image.src && !res.next.secondary.image.src) res.next = await this.getNextFirst();

    this.steps = res.steps;
    let previous = "";
    let next = "";
    let current = "";

    if (this.data.comics_config.is_page_order) {
      // 普通模式
      if (res.previous.primary.start) previous = previous + `<img style="opacity: 0;" src="${res.previous.primary.image.src}" />`;
      if (res.previous.secondary.image.src) previous = previous + `<img previousimage id="${res.previous.secondary.image.id}" src="${res.previous.secondary.image.src}" />`;
      if (res.previous.primary.image.src) previous = previous + `<img previousimage id="${res.previous.primary.image.id}" src="${res.previous.primary.image.src}" />`;
      if (res.previous.primary.end) previous = previous + `<img style="opacity: 0;" src="${res.previous.primary.image.src}" />`;

      if (res.current.primary.start) current = current + `<img style="opacity: 0;"  src="${res.current.primary.image.src}" />`;
      if (res.current.primary.image.src) current = current + `<img  currentimage id="${res.current.primary.image.id}" src="${res.current.primary.image.src}" />`;
      if (res.current.secondary.image.src) current = current + `<img currentimage id="${res.current.secondary.image.id}" src="${res.current.secondary.image.src}" />`;
      if (res.current.primary.end) current = current + `<img style="opacity: 0;"  src="${res.current.primary.image.src}" />`;

      if (res.next.primary.start) next = next + `<img style="opacity: 0;"  src="${res.next.primary.image.src}" />`;
      if (res.next.primary.image.src) next = next + `<img nextimage id="${res.next.primary.image.id}" src="${res.next.primary.image.src}" />`;
      if (res.next.secondary.image.src) next = next + `<img nextimage id="${res.next.secondary.image.id}" src="${res.next.secondary.image.src}" />`;
      if (res.next.primary.end) next = next + `<img style="opacity: 0;"  src="${res.next.primary.image.src}" />`;
    } else {
      // 日漫模式
      if (res.previous.primary.end) previous = previous + `<img style="opacity: 0;" src="${res.previous.primary.image.src}" />`;
      if (res.previous.primary.image.src) previous = previous + `<img previousimage id="${res.previous.primary.image.id}" src="${res.previous.primary.image.src}" />`;
      if (res.previous.secondary.image.src) previous = previous + `<img previousimage id="${res.previous.secondary.image.id}" src="${res.previous.secondary.image.src}" />`;
      if (res.previous.primary.start) previous = previous + `<img style="opacity: 0;"  src="${res.previous.primary.image.src}" />`;

      if (res.current.primary.end) current = current + `<img style="opacity: 0;"  src="${res.current.primary.image.src}" />`;
      if (res.current.secondary.image.src) current = current + `<img currentimage id="${res.current.secondary.image.id}" src="${res.current.secondary.image.src}" />`;
      if (res.current.primary.image.src) current = current + `<img  currentimage id="${res.current.primary.image.id}" src="${res.current.primary.image.src}" />`;
      if (res.current.primary.start) current = current + `<img style="opacity: 0;"  src="${res.current.primary.image.src}" />`;

      if (res.next.primary.end) next = next + `<img style="opacity: 0;"  src="${res.next.primary.image.src}" />`;
      if (res.next.secondary.image.src) next = next + `<img nextimage id="${res.next.secondary.image.id}" src="${res.next.secondary.image.src}" />`;
      if (res.next.primary.image.src) next = next + `<img nextimage id="${res.next.primary.image.id}" src="${res.next.primary.image.src}" />`;
      if (res.next.primary.start) next = next + `<img style="opacity: 0;"  src="${res.next.primary.image.src}" />`;
    }

    this.swiper.swiperRef.removeAllSlides();
    if (this.data.comics_config.is_page_direction) {
      if (!!previous) this.appendSlide(previous)
      if (!!current) this.appendSlide(current)
      if (!!next) this.appendSlide(next)
      if (!!previous) this.swiper.swiperRef.slideTo(1, 0, false);
    } else {
      if (!!next) this.appendSlide(next)
      if (!!current) this.appendSlide(current)
      if (!!previous) this.appendSlide(previous)
      if (!!previous) this.swiper.swiperRef.slideTo(1, 0, false);
    }
  }
  appendSlide(src: string) {
    this.swiper.swiperRef.appendSlide
      (`
     <div class="swiper-slide">
      <div style="width: 100%;height:100%;"  ></div>
       ${src}
      <div style="width: 100%;height:100%;"  ></div>
     </div>
    `)
  }

  async getNextFirst() {
    const res = {
      next: {
        primary: { image: { src: "", id: null }, end: false, start: false },
        secondary: { image: { src: "", id: null }, end: false, start: false }
      },
    }

    const list = await this.current._getNextChapter();


    if (list) {
      const index = 0;
      const images = list;
      const obj = await this.isWideImage(images[index], images[index + 1]);
      const total = images.length;
      const id = await this.current._getNextChapterId()
      const is_first_page_cover = await this.current._getChapter_IsFirstPageCover(id!);
      if (is_first_page_cover == true && index == 0) {
        obj.secondary.image = "";
      }
      if (obj.primary.width > obj.primary.height || obj.secondary.width > obj.secondary.height) {
        obj.secondary.image = "";
      }
      if (index >= (total - 1) && !obj.secondary.image) {
        if (obj.primary.width < obj.primary.height) res.next.primary.end = true;
      }
      if (obj.secondary.image) res.next.secondary.image = obj.secondary.image;
      if (obj.primary.image) res.next.primary.image = obj.primary.image;
      if (index == 0 && !obj.secondary.image) {
        if (obj.primary.width < obj.primary.height) res.next.primary.start = true;
      }
    }
    return res.next
  }
  async loadingNextFirstPage() {
    const list = await this.current._getNextChapter();
    if (list) {
      const index = 0;
      const images = list;
      const obj = await this.isWideImage(images[index], images[index + 1]);
    }
  }
  async getPreviousLast() {
    const res = {
      previous: {
        primary: { image: { src: "", id: null }, end: false, start: false },
        secondary: { image: { src: "", id: null }, end: false, start: false }
      },
    }
    const list = await this.current._getPreviousChapter();

    if (list) {
      const images = list;
      const total = images.length;
      const index = images.length;
      const obj = await this.isWideImage(images[index - 1], images[index]);
      if (index >= (total - 1) && !obj.secondary.image) {
        if (obj.primary.width < obj.primary.height) res.previous.primary.end = true;
      }
      if (obj.secondary.image) res.previous.secondary.image = obj.secondary.image;
      if (obj.primary.image) res.previous.primary.image = obj.primary.image;
      if (index == 0 && !obj.secondary.image) {
        if (obj.primary.width < obj.primary.height) res.previous.primary.start = true;
      }
    }
    return res.previous
  }
  loadImage = (url: string) => {
    return new Promise<any>((resolve, reject) => {
      if (url) {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject({ width: 0, height: 0 });
        img.src = url;
      } else {
        resolve({ width: 0, height: 0 });
      }
    });
  }

  isWideImage = async (primary: any, secondary: any) => {
    try {
      const [imgPrimary, imgSecondary] = await Promise.all([this.loadImage(primary?.src), this.loadImage(secondary?.src)]);
      if (imgPrimary.width > imgPrimary.height || imgSecondary.width > imgSecondary.height) {

        return {
          'primary': { image: primary ?? "", width: imgPrimary.width, height: imgPrimary.height },
          'secondary': { image: { src: "", id: null }, width: imgSecondary.width, height: imgSecondary.height }
        };
      } else {
        return {
          'primary': { image: primary ?? "", width: imgPrimary.width, height: imgPrimary.height },
          'secondary': { image: secondary ?? "", width: imgSecondary.width, height: imgSecondary.height }
        };
      }
    } catch (e) {
      return {
        'primary': { image: primary ?? "", width: 0, height: 0 },
        'secondary': { image: secondary ?? "", width: 0, height: 0 }
      };
    }
  }

  async getCurrentImages(list: Array<PagesItem>, index: number) {
    const total = list.length;

    const res = {
      steps: 0,
      previous: {
        primary: { image: { src: "", id: null }, end: false, start: false },
        secondary: { image: { src: "", id: null }, end: false, start: false }
      },
      current: {
        primary: { image: { src: "", id: null }, end: false, start: false },
        secondary: { image: { src: "", id: null }, end: false, start: false }
      },
      next: {
        primary: { image: { src: "", id: null }, end: false, start: false },
        secondary: { image: { src: "", id: null }, end: false, start: false }
      },
    }
    const obj = await this.isWideImage(list[index], list[index + 1]);
    let steps = 0;
    if (obj.primary.width > obj.primary.height || obj.secondary.width > obj.secondary.height) {
      steps = 1;
      obj.secondary.image = "";
    } else {
      steps = 2;
    }

    if (this.isFirst) {
      this.isFirst = false;
      obj.secondary.image = "";
      steps = 1;
    }

    if (this.isPageFirst) {
      this.isPageFirst = false;
      if (this.is_first_page_cover == true && index == 0) {
        obj.secondary.image = "";
        steps = 1;
      }
    } else {
      if (index == 0 && !this.isSwitch && this.is_first_page_cover == true) {
        obj.secondary.image = "";
        steps = 1;
      }
      if (index == 0 && this.isSwitch && this.is_first_page_cover == false) {
        obj.secondary.image = "";
        steps = 1;
      }
    }

    const [objPrevious, objNext] = await Promise.all([
      this.isWideImage(list[index - 1], list[index - 2]),
      this.isWideImage(list[index + steps], list[index + steps + 1])
    ]);
    setTimeout(() => {
      if (list[index + steps + 2]) this.loadImage(list[index + steps + 2]?.src)
      if (list[index + steps + 3]) this.loadImage(list[index + steps + 3]?.src)
      if (index >= list.length - 3) this.loadingNextFirstPage();
    }, 100)
    if (index >= (total - 1) && !obj.secondary.image) {
      if (obj.primary.width < obj.primary.height) res.current.primary.end = true;
    }
    if (obj.secondary.image) res.current.secondary.image = obj.secondary.image;
    if (obj.primary.image) res.current.primary.image = obj.primary.image;
    if (index == 0 && !obj.secondary.image) {
      if (obj.primary.width < obj.primary.height) res.current.primary.start = true;
    }

    if (objPrevious.primary.image) res.previous.primary.image = objPrevious.primary.image;
    if (objPrevious.secondary.image) res.previous.secondary.image = objPrevious.secondary.image;
    if (((index - 1) == 0 || (index - 2) == 0) && !objPrevious.secondary.image) {
      if (objPrevious.primary.width < objPrevious.primary.height) res.previous.primary.start = true;
    }

    if (((index + 1) >= (total - 1) || (index + 2) >= (total - 1)) && !objNext.secondary.image) {
      if (objNext.primary.width < objNext.primary.height) res.next.primary.end = true;
    }
    if (objNext.secondary.image) res.next.secondary.image = objNext.secondary.image;
    if (objNext.primary.image) res.next.primary.image = objNext.primary.image;
    res.steps = steps;

    return res
  }

}
