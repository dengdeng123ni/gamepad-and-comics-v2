import { Component } from '@angular/core';
import { CurrentService } from '../../services/current.service';
import { DataService } from '../../services/data.service';
import { AppDataService } from 'src/app/library/public-api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent {

  constructor(private Current: CurrentService,
    public data: DataService,
    public AppData:AppDataService,
    public router:Router
    ) {
      // this.Current.init();
  }

  on_list($event:any) {

  }

  on_item(e: { $event: HTMLElement, data: any }) {
    const $event = e.$event;
    const data = e.data;
    this.router.navigate(['/detail', data.id])
  }

  ngAfterViewInit() {
  }


  mouseleave($event:MouseEvent){
console.log($event);
console.log($event.offsetX+12,window.innerHeight);

    if($event.offsetX>12) return
    if($event.offsetX+12>window.innerHeight) return
    if(($event.offsetX+13)>window.innerWidth){

    }else{
      this.data.is_menu_opened=!this.data.is_menu_opened;
    }
    // if($event.offsetX<window.innerWidth){

    // }
  }

}
