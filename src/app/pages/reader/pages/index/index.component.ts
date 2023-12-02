import { Component } from '@angular/core';
import { CurrentService } from '../../services/current.service';
import { DataService } from '../../services/data.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { map } from 'rxjs';
import { OnePageThumbnailMode2Service } from '../../components/one-page-thumbnail-mode2/one-page-thumbnail-mode2.service';
import { IndexService } from './index.service';
import { ChaptersListService } from '../../components/chapters-list/chapters-list.service';
import { ToolbarOptionService } from '../../components/toolbar-option/toolbar-option.service';
import { CustomGridService } from '../../components/custom-grid/custom-grid.service';

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
    public route: ActivatedRoute,
    public left: OnePageThumbnailMode2Service,
    public ChaptersList:ChaptersListService,
    public index:IndexService,
    public ToolbarOption:ToolbarOptionService,
    public CustomGrid:CustomGridService
  ) {
    let id$ = this.route.paramMap.pipe(map((params: ParamMap) => params));
    id$.subscribe(params => {
      this.data.init();
      this.current._init(params.get('id') as string, params.get('sid') as string)
    })
  //  setTimeout(()=>{ this.CustomGrid.open();},1000)
  //  setTimeout(()=>{ this.ToolbarOption.open();},1000)
  }

  on($event: MouseEvent) {
     this.current.on$.next($event)
  }
  ngOnDestroy() {
    this.current.close();
  }
  close(){

  }



}
