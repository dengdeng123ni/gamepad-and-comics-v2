import { Component } from '@angular/core';
import { ContextMenuControllerService, DbControllerService, MessageControllerService, MessageEventService, SelectDataSourceService } from './library/public-api';
import { GamepadControllerService } from './library/gamepad/gamepad-controller.service';
import { GamepadLeftCircleToolbarService } from './library/event/gamepad-left-circle-toolbar/gamepad-left-circle-toolbar.service';
import { GamepadEventService } from './library/gamepad/gamepad-event.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  is_loading_page = false;
  is_data_source = true;



  constructor(
    public GamepadController:GamepadControllerService,
    public GamepadEvent:GamepadEventService,
    public MessageController: MessageControllerService,
    public GamepadLeftCircleToolbar:GamepadLeftCircleToolbarService,
    public MessageEvent: MessageEventService,
    public DbController: DbControllerService,
    public ContextMenuController: ContextMenuControllerService,
    public SelectDataSource:SelectDataSourceService
  ) {
    GamepadEvent.registerGlobalEvent({
      LEFT_ANALOG_PRESS:()=> GamepadLeftCircleToolbar.isToggle()
    })
    MessageEvent.service_worker_register('local_image', async (event: any) => {
      const data = event.data;
      const response = await DbController.getImage(data.id)
      return { id: data.id, type: "local_image", response: response }
    })
    this.init();

  }
  init() {
    this.getDataSource();
    this.getPulgLoadingFree();

  }

  getPulgLoadingFree() {
    if (document.body.getAttribute("pulg")) {
      this.is_loading_page = true;
    } else {
      setTimeout(() => {
        this.getPulgLoadingFree();
      })
    }
  }

  getDataSource() {
    const data = localStorage.getItem("data_source");
    if (data) {
      document.body.setAttribute("data_source",data);
      this.is_data_source=true;
    }else{
      // this.SelectDataSource.open();
    }
  }

}
