import { Component } from '@angular/core';
import { CurrentService } from '../../services/current.service';
import { DataService } from '../../services/data.service';
interface Item { id: string, src: string, width: number, height: number }
@Component({
  selector: 'app-multiple-page-reader-mode2',
  templateUrl: './multiple-page-reader-mode2.component.html',
  styleUrls: ['./multiple-page-reader-mode2.component.scss']
})
export class MultiplePageReaderMode2Component {
  pages: Item[] = [];
  page_index = 0;

  change$;
  init$;

  constructor(
    public current: CurrentService,
    public data: DataService
  ) {
    this.init$ = this.current.init().subscribe(x => {
      this.pages = x;
      this.change(this.data.page_index)
    })
    this.change$ = this.current.change().subscribe(x => {
      if (x.type == "changePage") {
        this.pages = x.pages;
        this.change(x.page_index);
      } else if (x.type == "changeChapter") {
        this.pages = x.pages;
        this.change(x.page_index);
      } else if (x.type == "nextPage") {
        this.next()
      } else if (x.type == "previousPage") {
        this.previous()
      }
    })
  }
  ngOnDestroy() {
    this.change$.unsubscribe();
    this.init$.unsubscribe();
  }
  ngAfterViewInit() {
    this.change(this.data.page_index)
  }

  async change(page_index: number) {
    const container = document.getElementById("one_page_reader")
    if (container) return
    container!.classList.remove("opacity-0");
    const node = document.getElementById(`one_page_reader_${page_index}`);
    node!.scrollIntoView(true)
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
