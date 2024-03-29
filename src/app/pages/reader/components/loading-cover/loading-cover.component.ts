import { Component } from '@angular/core';
import { CurrentService } from '../../services/current.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-loading-cover',
  templateUrl: './loading-cover.component.html',
  styleUrls: ['./loading-cover.component.scss']
})
export class LoadingCoverComponent {
  cover = "";
  constructor(private data: DataService) {
    this.cover = this.data.comics_info.cover
    console.log(this.data.comics_info);

  }



}
