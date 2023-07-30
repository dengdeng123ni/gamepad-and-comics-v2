import { Component, EventEmitter, Input, Output } from '@angular/core';
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

  @Input() is_edit?: boolean = false;
  @Input() list: Array<Item> = [];
  @Input() size?: string = "middle"; // large middle small
  @Input() last_read_id?: string | number = "";

  @Output() on_item = new EventEmitter<{ $event: HTMLElement, data: any }>();

  @Output() on_list = new EventEmitter<HTMLElement>();

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
      this.on_item.emit({ $event: target_node, data: { ...this.list[index], index } });
    }
  }
}
