import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Observable, map, startWith } from 'rxjs';
import { FormControl } from '@angular/forms';
declare const window: any;
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
  myControl = new FormControl('');
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;
  constructor(public data: DataService) {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value: any) => this._filter(value || '')),
    );
   }
  on(type: string) {
    this.data.qurye_page_type = type;
    this.data.list=[];
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter((option: string) => option.toLowerCase().includes(filterValue));
  }
}
