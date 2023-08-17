import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReaderRoutingModule } from './reader-routing.module';
import { IndexComponent } from './pages/index/index.component';
import { SwiperModule } from 'swiper/angular';
import { Mode1Component } from './components/mode1/mode1.component';
import { ReaderToolbarComponent } from './components/reader-toolbar/reader-toolbar.component';
import { MaterialModule } from 'src/app/library/material.module';
import { DoublePageThumbnailComponent } from './components/double-page-thumbnail/double-page-thumbnail.component';
import { ChaptersThumbnailComponent } from './components/chapters-thumbnail/chapters-thumbnail.component';
import { OnePageThumbnailMode1Component } from './components/one-page-thumbnail-mode1/one-page-thumbnail-mode1.component';
import { OnePageThumbnailMode2Component } from './components/one-page-thumbnail-mode2/one-page-thumbnail-mode2.component';
import { OnePageThumbnailMode3Component } from './components/one-page-thumbnail-mode3/one-page-thumbnail-mode3.component';
import { OnePageThumbnailMode4Component } from './components/one-page-thumbnail-mode4/one-page-thumbnail-mode4.component';

@NgModule({
  declarations: [
    IndexComponent,
    Mode1Component,
    ReaderToolbarComponent,
    DoublePageThumbnailComponent,
    ChaptersThumbnailComponent,
    OnePageThumbnailMode1Component,
    OnePageThumbnailMode2Component,
    OnePageThumbnailMode3Component,
    OnePageThumbnailMode4Component
  ],
  imports: [
    CommonModule,
    ReaderRoutingModule,
    MaterialModule,
    SwiperModule,
  ]
})
export class ReaderModule { }
