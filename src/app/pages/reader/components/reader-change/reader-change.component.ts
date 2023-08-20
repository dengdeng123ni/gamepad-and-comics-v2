import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-reader-change',
  templateUrl: './reader-change.component.html',
  styleUrls: ['./reader-change.component.scss']
})
export class ReaderChangeComponent {
  constructor(public data:DataService) { }

  change(e:string){

  }
}
