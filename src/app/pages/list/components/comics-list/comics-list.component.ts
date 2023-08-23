import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DataService } from '../../services/data.service';
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
  selector: 'comics-list',
  templateUrl: './comics-list.component.html',
  styleUrls: ['./comics-list.component.scss']
})

export class ComicsListComponent {
constructor(public data:DataService){

}
  @Input() is_edit?: boolean = false;
  @Input() list: Array<Item> = [];
  @Input() size?: string = "middle"; // large middle small
  @Input() last_read_id?: string | number = "";

  @Output() on_item = new EventEmitter<{ $event: HTMLElement, data: any }>();

  @Output() on_list = new EventEmitter<HTMLElement>();

  page_size = 0;
  on($event: MouseEvent) {
    const node = $event.target as HTMLElement;
    if (node.getAttribute("id") == 'list') {
      this.on_list.emit(node);
    } else {
      const getTargetNode = (node: HTMLElement): HTMLElement => {
        if (node.getAttribute("region") == "comics_list_item") {
          return node
        } else {
          return getTargetNode(node.parentNode as HTMLElement)
        }
      }
      const target_node = getTargetNode(node);
      const index = parseInt(target_node.getAttribute("index") as string);
      this.on_item.emit({ $event: target_node, data: { ...this.data._list[index], index } });
    }
  }

  ngAfterViewInit() {
    const i_w = 172.8;
    const i_h = 276.8;
    const node: any = document.querySelector("comics-list");
    let w2 = ((node.clientWidth - 32) / i_w);
    let h2 = (node.clientHeight / i_h);
    if (h2 < 1) h2 = 1;
    else h2 = h2 + 1;
    this.page_size = Math.trunc(h2) * Math.trunc(w2);
    node!.addEventListener('scroll', (e: any) => {
      this.handleScroll(e)
    }, true)
    this.getData();
  }

  getData() {
    if (this.list.length) {
      this.add_pages();
    } else {
      setTimeout(() => {
        this.getData()
      }, 10)
    }
  }
  handleScroll(e: any) {
    const node: any = document.querySelector("comics-list");
    let scrollHeight = Math.max(node.scrollHeight, node.scrollHeight);
    let scrollTop = e.target.scrollTop;
    let clientHeight = node.innerHeight || Math.min(node.clientHeight, node.clientHeight);
    if (clientHeight + scrollTop + 50 >= scrollHeight) {
      this.add_pages();
    }
  }

  add_pages() {
    this.data._list = [...this.data._list, ...this.list.splice(0, this.page_size)]
  }
}
