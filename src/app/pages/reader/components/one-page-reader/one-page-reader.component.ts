import { Component } from '@angular/core';
import { CurrentService } from '../../services/current.service';
import { DataService } from '../../services/data.service';
import { GamepadEventService } from 'src/app/library/gamepad/gamepad-event.service';
import { GamepadControllerService } from 'src/app/library/gamepad/gamepad-controller.service';
import { ImageService } from 'src/app/library/public-api';

@Component({
  selector: 'app-one-page-reader',
  templateUrl: './one-page-reader.component.html',
  styleUrls: ['./one-page-reader.component.scss']
})
export class OnePageReaderComponent {
  items = Array.from({ length: 100000 }).map((_, i) => `Item #${i}`);
  list = [];
  width=0;
  height=0;
  constructor(
    public current: CurrentService,
    public data: DataService,
    public image:ImageService,
    public GamepadEvent: GamepadEventService,
    public GamepadController: GamepadControllerService
  ) {
    console.log();


    // console.log(this.list);

    // this.change(this.data.age_index)

    // this.change$ = this.current.change().subscribe(x => {
    //   this.zoom(1);
    //   if (x.type == "changePage") {
    //     this.change(x.page_index);
    //   } else if (x.type == "changeChapter") {
    //     this.list = x.pages;
    //     this.isPageFirst = true;
    //     this.isSwitch = false;
    //     this.change(x.page_index);
    //   } else if (x.type == "nextPage") {
    //     this.next()
    //   } else if (x.type == "previousPage") {
    //     this.previous()
    //   }
    // })
    // this.event$ = this.current.event().subscribe(x => {
    //   if (x.key == "double_page_reader_FirstPageToggle") {
    //     this.firstPageToggle();
    //   } else if (x.key == "double_page_reader_togglePage") {
    //     this.pageToggle();
    //   }
    // })

this.init();
  }
  async init(){
    this.list = this.data.pages as any;
    // console.log(this.list);
    this.width = window.innerWidth / 2;
    let height=0
    this.list.forEach(x => {
      height=((x.height/x.width) * this.width)+height;
    })
    this.height=Math.ceil(height/this.list.length);
    console.log(this.height);

  }

}
