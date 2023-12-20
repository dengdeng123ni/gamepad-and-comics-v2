import { Injectable } from '@angular/core';
import { GamepadEventService } from 'src/app/library/gamepad/gamepad-event.service';

@Injectable({
  providedIn: 'root'
})
export class IndexService {

  constructor(public GamepadEvent:GamepadEventService) {


    GamepadEvent.registerConfig("list", { region: ["comics_item","comics_option"] })

    console.log(GamepadEvent);

  }
}
