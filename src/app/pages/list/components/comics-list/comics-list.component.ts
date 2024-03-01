import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DataService } from '../../services/data.service';
import { CurrentService } from '../../services/current.service';
import { Router } from '@angular/router';
import { Subject, throttleTime } from 'rxjs';
import { ContextMenuEventService } from 'src/app/library/public-api';
import { WebFileService } from 'src/app/library/web-file/web-file.service';
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
    public ContextMenuEvent: ContextMenuEventService,
    public router: Router,
    public WebFile:WebFileService
  ) {

    ContextMenuEvent.register('comics_item', {
      open: () => {
        // this.close()
      },
      close: (e: any) => {

      },
      on: async (e: { value: string; id: string; }) => {
        WebFile.downloadComics(e.value,{type:'PDF'})
      },
      menu: [
        { name: "下载本地", id: "thumbnail" },
        // { name: "delete", id: "delete" },
      ]
    })
  }
  on($event: MouseEvent) {
    const node = $event.target as HTMLElement;
    if (node.getAttribute("id") == 'comics_list') {
      // this.onlist.emit(node);
    } else {
      const getTargetNode = (node: HTMLElement): HTMLElement => {
        if (node.getAttribute("region") == "comics_item") {
          return node
        } else {
          return getTargetNode(node.parentNode as HTMLElement)
        }
      }
      const target_node = getTargetNode(node);
      const index = parseInt(target_node.getAttribute("index") as string);
      const data = this.data.list[index]
      this.router.navigate(['/detail', data.id]);
    }
  }



  ngAfterViewInit() {
    const node: any = document.querySelector("#comics_list");


    node!.addEventListener('scroll', (e: any) => {
      this.scroll$.next(e)
    }, true)
    this.scroll$.pipe(throttleTime(300)).subscribe(e => {
      this.handleScroll(e);
    })
  }
  scroll$ = new Subject();
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
  ngOnDestroy() {
    this.scroll$.unsubscribe();
  }
  async add_pages() {
    window.comics_query_option.page_num++;
    const list = await this.current.getList()
    if (list.length == 0) {
      window.comics_query_option.page_num--;
      return
    }
    this.data.list = [...this.data.list, ...list]
  }
}
