import { Component, EventEmitter, Input, Output } from '@angular/core';
interface Item {
  id: string | number,
  cover: string,
  title: string,
  read?: number,
  selected?: boolean
}
@Component({
  selector: 'app-chapter-list-mode1',
  templateUrl: './chapter-list-mode1.component.html',
  styleUrls: ['./chapter-list-mode1.component.scss']
})
export class ChapterListMode1Component {
  @Input() is_edit?: boolean = false;
  @Input() list: Array<Item> = [];
  @Input() size?: string = "middle"; // large middle small
  @Input() last_read_id?: string | number = "";

  @Output() on_item = new EventEmitter<{ $event: HTMLElement, data: any }>();

  @Output() on_list = new EventEmitter<HTMLElement>();

}
