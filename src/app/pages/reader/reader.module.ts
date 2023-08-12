import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReaderRoutingModule } from './reader-routing.module';
import { IndexComponent } from './pages/index/index.component';
import { SwiperModule } from 'swiper/angular';
import { Mode1Component } from './components/mode1/mode1.component';
import { ReaderToolbarComponent } from './components/reader-toolbar/reader-toolbar.component';
import { MaterialModule } from 'src/app/library/material.module';

@NgModule({
  declarations: [
    IndexComponent,
    Mode1Component,
    ReaderToolbarComponent
  ],
  imports: [
    CommonModule,
    ReaderRoutingModule,
    MaterialModule,
    SwiperModule,
  ]
})
export class ReaderModule { }
