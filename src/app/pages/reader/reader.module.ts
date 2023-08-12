import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReaderRoutingModule } from './reader-routing.module';
import { IndexComponent } from './pages/index/index.component';
import { SwiperModule } from 'swiper/angular';
import { Mode1Component } from './components/mode1/mode1.component';

@NgModule({
  declarations: [
    IndexComponent,
    Mode1Component
  ],
  imports: [
    CommonModule,
    ReaderRoutingModule,
    SwiperModule
  ]
})
export class ReaderModule { }
