import { Component } from '@angular/core';
import { ContextMenuControllerService, DbControllerService, MessageControllerService, MessageEventService } from './library/public-api';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  is_loading_page = false;




  constructor(
    public MessageController: MessageControllerService,
    public MessageEvent: MessageEventService,
    public DbController: DbControllerService,
    public ContextMenuController: ContextMenuControllerService
  ) {
    MessageEvent.service_worker_register('local_image', async (event: any) => {
      const data = event.data;
      const response = await DbController.getImage(data.id)
      return { id: data.id, type: "local_image", response: response }
    })
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
