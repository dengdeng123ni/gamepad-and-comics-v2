import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReaderRoutingModule } from './reader-routing.module';
import { IndexComponent } from './pages/index/index.component';
import { SwiperModule } from 'swiper/angular';
import { ReaderToolbarComponent } from './components/reader-toolbar/reader-toolbar.component';
import { MaterialModule } from 'src/app/library/material.module';
import { DoublePageThumbnailComponent } from './components/double-page-thumbnail/double-page-thumbnail.component';
import { ChaptersThumbnailComponent } from './components/chapters-thumbnail/chapters-thumbnail.component';
import { OnePageThumbnailMode1Component } from './components/one-page-thumbnail-mode1/one-page-thumbnail-mode1.component';
import { OnePageThumbnailMode2Component } from './components/one-page-thumbnail-mode2/one-page-thumbnail-mode2.component';
import { OnePageThumbnailMode3Component } from './components/one-page-thumbnail-mode3/one-page-thumbnail-mode3.component';
import { OnePageThumbnailMode4Component } from './components/one-page-thumbnail-mode4/one-page-thumbnail-mode4.component';
import { DoublePageReaderComponent } from './components/double-page-reader/double-page-reader.component';
import { ReaderNavbarBarComponent } from './components/reader-navbar-bar/reader-navbar-bar.component';
import { ReaderSectionComponent } from './components/reader-section/reader-section.component';

@NgModule({
  declarations: [
    IndexComponent,
    ReaderToolbarComponent,
    DoublePageThumbnailComponent,
    ChaptersThumbnailComponent,
    OnePageThumbnailMode1Component,
    OnePageThumbnailMode2Component,
    OnePageThumbnailMode3Component,
    OnePageThumbnailMode4Component,
    DoublePageReaderComponent,
    ReaderNavbarBarComponent,
    ReaderSectionComponent
  ],
  imports: [
    CommonModule,
    ReaderRoutingModule,
    MaterialModule,
    SwiperModule,
  ]
})
export class ReaderModule { }
