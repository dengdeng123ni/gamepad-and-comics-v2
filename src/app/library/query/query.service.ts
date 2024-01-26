import { Injectable } from '@angular/core';
import { QueryComponent } from './query.component';
import { GamepadEventService } from '../gamepad/gamepad-event.service';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class QueryService {

  opened = false;
  constructor(
    public _dialog: MatDialog,
    public GamepadEvent:GamepadEventService,
  ) {

    GamepadEvent.registerAreaEvent('query_mode1_item',{
      B:()=>setTimeout(()=>this.close())
    })
  }
  open() {
    if (this.opened == false) {
      this.opened = true;

      const dialogRef = this._dialog.open(QueryComponent, {
        panelClass: "_query_mode1"
      });
      document.body.setAttribute("locked_region", "query_mode1")
      dialogRef.afterClosed().subscribe(result => {
        if (document.body.getAttribute("locked_region") == "query_mode1" && this.opened) document.body.setAttribute("locked_region", "reader")
        this.opened = false;
      });
    }
  }


  isToggle = () => {
    if (this.opened) this.close()
    else this.open()
  }
  close() {
    this._dialog.closeAll();
  }
}
