import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DataService } from '../../services/data.service';
import { CurrentService } from '../../services/current.service';
import { WindowEventService } from 'src/app/library/public-api';
import { Router } from '@angular/router';
declare const window: any;
interface Item {
  id: string | number,
  cover: string,
  title: string,
  subTitle: string,
  index?: number,
  selected?: boolean,
  tags?: Array<string>
}
@Component({
  selector: 'app-comics-list',
  templateUrl: './comics-list.component.html',
  styleUrls: ['./comics-list.component.scss']
})

export class ComicsListComponent {
  constructor(public data: DataService,
    public current: CurrentService,
    public WindowEvent: WindowEventService,
    public router:Router
  ) {
    WindowEvent.registerClickRegion('comics_item', (e: any) => {
      const { node } = e;
      const index = parseInt(node.getAttribute("index") as string);
      const data=this.data.list[index]
      this.router.navigate(['/detail', data.id]);
    })
  }


  page_size = 0;
  page_num = 1;

  ngAfterViewInit() {
    const i_w = 172.8;
    const i_h = 276.8;
    const node: any = document.querySelector("app-comics-list");
    let w2 = ((node.clientWidth - 32) / i_w);
    let h2 = (node.clientHeight / i_h);
    if (h2 < 1) h2 = 1;
    else h2 = h2 + 1;
    window.comics_query_option.page_size = Math.trunc(h2) * Math.trunc(w2);
    this.add_pages();
    node!.addEventListener('scroll', (e: any) => {
      this.handleScroll(e)
    }, true)
    this.getData();
  }

  getData() {
    if (this.data.list.length) {
      this.add_pages();
    } else {
      setTimeout(() => {
        this.getData()
      }, 10)
    }
  }
  async handleScroll(e: any) {
    const node: any = document.querySelector("app-comics-list");
    let scrollHeight = Math.max(node.scrollHeight, node.scrollHeight);
    let scrollTop = e.target.scrollTop;
    let clientHeight = node.innerHeight || Math.min(node.clientHeight, node.clientHeight);
    if (clientHeight + scrollTop + 50 >= scrollHeight) {
      await this.add_pages();
    }
  }

  async add_pages() {
    const list = await this.current.getList()
    if (list.length == 0) return
    this.data.list = [...this.data.list, ...list]
    window.comics_query_option.page_num++;
  }
}
