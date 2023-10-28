import { Component } from '@angular/core';
import { ContextMenuControllerService, DbControllerService, MessageControllerService, MessageEventService, SelectDataSourceService } from './library/public-api';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  is_loading_page = false;
  is_data_source = false;



  constructor(
    public MessageController: MessageControllerService,
    public MessageEvent: MessageEventService,
    public DbController: DbControllerService,
    public ContextMenuController: ContextMenuControllerService,
    public SelectDataSource:SelectDataSourceService
  ) {
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
