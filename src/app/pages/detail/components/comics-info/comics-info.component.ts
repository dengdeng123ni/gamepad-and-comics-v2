import { Component, EventEmitter, Input, Output } from '@angular/core';
interface Info {
  cover: string,
  title: string,
  author?: string,
  intro?: string
}
@Component({
  selector: 'app-comics-info',
  templateUrl: './comics-info.component.html',
  styleUrls: ['./comics-info.component.scss']
})
export class ComicsInfoComponent {
  @Input() info!: Info;


  @Output() on_back = new EventEmitter<MouseEvent>();
  @Output() on_continue = new EventEmitter<MouseEvent>();

  back($event: MouseEvent) {
    this.on_back.emit($event);
  }

  continue($event: MouseEvent) {
    this.on_continue.emit($event);
  }
}
