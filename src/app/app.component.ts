import { Component } from '@angular/core';
import { MessageControllerService } from './library/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'gamepad-and-comics-v2';
  constructor(public MessageController:MessageControllerService){

  }

}
