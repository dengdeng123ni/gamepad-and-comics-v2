import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DataService } from '../../services/data.service';
import { ContextMenuEventService } from 'src/app/library/public-api';
import { ExportSettingsService } from '../export-settings/export-settings.service';
import { DoublePageThumbnailService } from '../double-page-thumbnail/double-page-thumbnail.service';
import { CurrentService } from '../../services/current.service';
interface Item {
  id: string | number,
  cover: string,
  title: string,
  short_title?: string,
  pub_time?: string | Date | number,
  read?: number,
  ord?: number,
  selected?: boolean,
  like_count?: number | string,
  comments?: number | string,
  is_locked?: boolean
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
  constructor(public data: DataService,public current:CurrentService,public doublePageThumbnail:DoublePageThumbnailService, public ContextMenuEvent: ContextMenuEventService, public exportSettings: ExportSettingsService,) {
    ContextMenuEvent.register('chapter_item', {
      close: (e: any) => {

      },
      on: async (e: { value: string; id: string; }) => {
        if (e.id == "delete") {
        } else if (e.id == "thumbnail") {
          const id = e.value
          const index = await this.current._getChapterIndex(id);
          this.doublePageThumbnail.open({
            chapter_id: id,
            page_index: index
          })

        }
        else if (e.id == "export") {
          const node = document.getElementById("menu_content");
          let { x, y, width, height } = node!.getBoundingClientRect();
          if (window.innerWidth < (x + 262)) x = window.innerWidth - 262
          if (window.innerHeight < (y + 212)) y = window.innerHeight - 212
          this.exportSettings.open({
            position: {
              top: `${y}px`,
              left: `${x}px`
            },
            delayFocusTrap: false,
            panelClass: "reader_settings_buttom",
            backdropClass: "reader_settings_buttom_backdrop"
          })
        }
      },
      menu: [
        { name: "thumbnail", id: "thumbnail" },
        { name: "export", id: "export" },
        { name: "delete", id: "delete" },
      ]
    })
  }
  on($event: MouseEvent) {
    const node = $event.target as HTMLElement;
    if (node.getAttribute("id") == 'list') {
      this.on_list.emit(node);
    } else {
      const getTargetNode = (node: HTMLElement): HTMLElement => {
        if (node.getAttribute("region") == "chapter_item") {
          return node
        } else {
          return getTargetNode(node.parentNode as HTMLElement)
        }
      }
      const target_node = getTargetNode(node);
      const index = parseInt(target_node.getAttribute("index") as string);
      if (this.data.is_edit) {
        this.list[index].selected = !this.list[index].selected;
      } else {
        this.on_item.emit({ $event: target_node, data: { ...this.list[index], index } });
      }

    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const node = document.getElementById(`${this.data.chapter_id}`)
      node!.scrollIntoView({ block: "center", inline: "center" })
      node?.focus()
    })
  }
}
