import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  list = [
    {
      icon: "",
      name: "",
      component: ""
    }
  ];

  constructor(public data: DataService) { }
  on(type: string) {
    this.data.qurye_page_type = type;
    console.log(this.data.qurye_page_type );

  }
}
