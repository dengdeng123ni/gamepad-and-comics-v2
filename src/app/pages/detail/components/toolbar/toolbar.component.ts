import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'detail-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
constructor(public data:DataService){}
}
