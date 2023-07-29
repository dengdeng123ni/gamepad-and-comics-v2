import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListRoutingModule } from './list-routing.module';
import { IndexComponent } from './pages/index/index.component';
import { MaterialModule } from 'src/app/library/material.module';


@NgModule({
  declarations: [
    IndexComponent
  ],
  imports: [
    CommonModule,
    ListRoutingModule,
    MaterialModule
  ]
})
export class ListModule { }
