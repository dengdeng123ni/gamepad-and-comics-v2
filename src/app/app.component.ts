import { Component } from '@angular/core';
import { MessageControllerService } from './library/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  is_loading_page = false;
  constructor(public MessageController: MessageControllerService) {
    this.init();
  }
  init() {
    this.getPulgLoadingFree();
  }

  getPulgLoadingFree() {
    setTimeout(() => {
      if (document.body.getAttribute("pulg")) {
        this.is_loading_page = true;
      } else {
        this.getPulgLoadingFree();
      }
    })
  }

}
