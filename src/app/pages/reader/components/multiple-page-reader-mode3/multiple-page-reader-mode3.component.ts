import { Component } from '@angular/core';
import { CurrentService } from '../../services/current.service';
import { DataService } from '../../services/data.service';
import { ImageService } from 'src/app/library/public-api';
interface Item { chapter_id:string,id: string, src: string, width: number, height: number }
@Component({
  selector: 'app-multiple-page-reader-mode3',
  templateUrl: './multiple-page-reader-mode3.component.html',
  styleUrls: ['./multiple-page-reader-mode3.component.scss']
})
export class MultiplePageReaderMode3Component {
  pages: Item[] = [];
  page_index = 0;

  change$;

  constructor(
    public current: CurrentService,
    public image: ImageService,
    public data: DataService
  ) {

    this.pages = this.data.pages.map(x => ({ ...x, chapter_id: this.data.chapter_id }));
    this.change$ = this.current.change().subscribe(x => {
      if (x.trigger == "up_down_page_reader") return
      if (x.type == "changePage") {
        this.pages = x.pages.map(c => ({ ...c, chapter_id:x.chapter_id }));
        this.pageChnage(x.page_index);
      } else if (x.type == "changeChapter") {
        this.pages = x.pages.map(c => ({ ...c, chapter_id:x.chapter_id }));
        this.pageChnage(x.page_index);
        this.init();
      } else if (x.type == "nextPage") {
        this.next()
      } else if (x.type == "previousPage") {
        this.previous()
      }
    })
  }
  ngOnDestroy() {
    this.change$.unsubscribe();

  }
  ngAfterViewInit() {
    const container = document.getElementById("multiple_page_reader_mode3")
    container.addEventListener("scroll", (event) => {
      if ((-container.scrollLeft / container.scrollWidth) > 0.7) {
        this.nec()
      }

    });
    if (container) container.classList.remove("opacity-0");
    setTimeout(() => {
      this.pageChnage(this.data.page_index)
      this.init();
    }, 100)

    setInterval(()=>{
      this.init();
    },500)

  }
  cccc = false
  async nec() {
    if (this.cccc) return
    this.cccc = true;
    const id = await this.current._getNextChapterId()
    const pages = await this.current._getChapter(id)
    this.data.chapter_id = id;
    for (let index = 0; index < pages.length; index++) {
      let obj: any = {};
      const img = await this.loadImage(pages[index].src)
      obj["id"] = pages[index].id;
      obj["src"] = img.src;
      obj["width"] = img.width;
      obj["height"] = img.height;
      obj["chapter_id"]=id;
      this.pages.push(obj)
    }
    this.cccc = false;
  }
  loadImage = async (url: string) => {
    url = await this.image.getImageBase64(url)
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

  async pageChnage(page_index: number) {
    const node = document.getElementById(`multiple_page_reader_mode3_${page_index}`);
    node!.scrollIntoView(true)
  }
  async init() {
    const nodes = document.querySelectorAll(".list app-image");
    var observer = new IntersectionObserver(
      (changes) => {
        changes.forEach((change: any) => {
          if (change.isIntersecting || change.isVisible) {
            var container = change.target;
            const id = container.getAttribute('chapter_id');
            const index = parseInt(container.getAttribute('index'));
            this.current._change('changePage', { pages: this.data.pages, chapter_id:id, page_index: index, trigger: "up_down_page_reader" })
          } else {
            var container = change.target;
            const id = parseInt(container.getAttribute('id'));
            const index = parseInt(container.getAttribute('index'));
          }
        });
      }
    );
    nodes.forEach(node => observer.observe(node))
  }
  next() {
    const page_index = this.page_index + 1;
    if (page_index >= this.pages.length) {

      return
    }
    this.current._pageChange(page_index);
  }
  previous() {
    const page_index = this.page_index - 1;
    if (page_index <= 0) {

      return
    }
    this.current._pageChange(page_index);
  }
}
