import { Component } from '@angular/core';
import { CurrentService } from '../../services/current.service';
import { DataService } from '../../services/data.service';

interface Item { id: string, src: string, width: number, height: number }
@Component({
  selector: 'app-multiple-page-reader-mode1',
  templateUrl: './multiple-page-reader-mode1.component.html',
  styleUrls: ['./multiple-page-reader-mode1.component.scss']
})
export class MultiplePageReaderMode1Component {
  pages: Item[] = [];
  page_index = 0;

  change$;

  constructor(
    public current: CurrentService,
    public data: DataService
  ) {
    this.pages = this.data.pages;

    this.change$ = this.current.change().subscribe(x => {
      if (x.trigger == "up_down_page_reader") return
      if (x.type == "changePage") {
        this.pages = x.pages;
        this.pageChnage(x.page_index);
      } else if (x.type == "changeChapter") {
        this.pages = x.pages;
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
    const container = document.getElementById("multiple_page_reader_mode1")
    if(container) container.classList.remove("opacity-0");
    this.pageChnage(this.data.page_index)
    this.init();
  }

  async pageChnage(page_index: number) {
    const node = document.getElementById(`multiple_page_reader_mode1_${page_index}`);
    node!.scrollIntoView(true)
  }
  async init() {
    let list = [];
    const nodes = document.querySelectorAll(".list img");
    nodes.forEach(x => list.push(x.getBoundingClientRect()))
    var observer = new IntersectionObserver(
      (changes) => {
        changes.forEach((change: any) => {
          if (change.isIntersecting || change.isVisible) {
            var container = change.target;
            const id = parseInt(container.getAttribute('id'));
            const index = parseInt(container.getAttribute('index'));
            this.current._change('changePage', { pages: this.data.pages, page_index: index, trigger: "up_down_page_reader" })
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
