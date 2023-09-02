import { Component } from '@angular/core';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-toolbar-option',
  templateUrl: './toolbar-option.component.html',
  styleUrls: ['./toolbar-option.component.scss']
})
export class ToolbarOptionComponent {
   list:any=[];
   constructor(public event:EventService){
    Object.keys(event.Events).forEach(x=>{
      this.list.push({
        id:x,
        name:event.Events[x].name
      })
    })
   }
}
