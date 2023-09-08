import { Component } from '@angular/core';
import { CurrentService } from '../../services/current.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-set-chapter-first-page-cover',
  templateUrl: './set-chapter-first-page-cover.component.html',
  styleUrls: ['./set-chapter-first-page-cover.component.scss']
})
export class SetChapterFirstPageCoverComponent {
  constructor(
    public current:CurrentService,
    public data:DataService
  ){}
  change(e:string){

  }
}
