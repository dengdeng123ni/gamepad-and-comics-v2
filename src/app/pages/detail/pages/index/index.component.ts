import { Component } from '@angular/core';
import { CurrentService } from '../../services/current.service';
import { DataService } from '../../services/data.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent {
  constructor(
    public current: CurrentService,
    public data: DataService,
    public router: Router,
    public route: ActivatedRoute
  ) {
    let id$ = this.route.paramMap.pipe(map((params: ParamMap) => params.get('id')));
    id$.subscribe(x => {
      this.data.init();
      this.current.init(x as string)
    })
  }
  ngOnDestroy() {
    this.data.is_left_drawer_opened=false;
    this.current.close();
  }
  back() {
    this.router.navigate(['/'])
  }
  continue() {
    this.router.navigate(['/', this.data.comics_id,this.data.chapter_id,])
  }

  on_list($event: HTMLElement) {

  }

  on_item(e: { $event: HTMLElement, data: any }) {
    const $event = e.$event;
    const data = e.data;
    this.router.navigate(['/', this.data.comics_id,data.id,])
  }
  mouseleave($event:MouseEvent){
    if($event.offsetX>24) return
    if($event.offsetX+24>window.innerHeight) return
    if(($event.offsetX+13)>window.innerWidth){

    }else{
      this.data.is_left_drawer_opened=true;
    }
    // if($event.offsetX<window.innerWidth){

    // }
  }
  drawer_mouseleave($event:MouseEvent){
    if($event.offsetX>240) {
      this.data.is_left_drawer_opened=false;
    }
  }
}
