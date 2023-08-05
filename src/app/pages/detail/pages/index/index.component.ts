import { Component } from '@angular/core';
import { CurrentService } from '../../services/current.service';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent {
  constructor(
    public Current:CurrentService,
    public Data:DataService,
    public router:Router
    ){
      this.Current.init();
  }
  back(){
    this.router.navigate(['/'])
  }
  continue(){

  }
}
