import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReaderRoutingModule } from './reader-routing.module';
import { IndexComponent } from './pages/index/index.component';
import { ReaderToolbarComponent } from './components/reader-toolbar/reader-toolbar.component';
import { MaterialModule } from 'src/app/library/material.module';
import { DoublePageThumbnailComponent } from './components/double-page-thumbnail/double-page-thumbnail.component';
import { ChaptersThumbnailComponent } from './components/chapters-thumbnail/chapters-thumbnail.component';
import { OnePageThumbnailMode1Component } from './components/one-page-thumbnail-mode1/one-page-thumbnail-mode1.component';
import { OnePageThumbnailMode2Component } from './components/one-page-thumbnail-mode2/one-page-thumbnail-mode2.component';
import { OnePageThumbnailMode3Component } from './components/one-page-thumbnail-mode3/one-page-thumbnail-mode3.component';
import { OnePageThumbnailMode4Component } from './components/one-page-thumbnail-mode4/one-page-thumbnail-mode4.component';
import { ReaderNavbarBarComponent } from './components/reader-navbar-bar/reader-navbar-bar.component';
import { ReaderSectionComponent } from './components/reader-section/reader-section.component';
import { OnePageReaderComponent } from './components/one-page-reader/one-page-reader.component';
import { MultiplePageReaderMode1Component } from './components/multiple-page-reader-mode1/multiple-page-reader-mode1.component';
import { MultiplePageReaderMode3Component } from './components/multiple-page-reader-mode3/multiple-page-reader-mode3.component';
import { MultiplePageReaderMode2Component } from './components/multiple-page-reader-mode2/multiple-page-reader-mode2.component';
import { ReaderChangeComponent } from './components/reader-change/reader-change.component';
import { CustomGridComponent } from './components/custom-grid/custom-grid.component';
import { ToolbarOptionComponent } from './components/toolbar-option/toolbar-option.component';
import { SetChapterFirstPageCoverComponent } from './components/set-chapter-first-page-cover/set-chapter-first-page-cover.component';
import { ChaptersListComponent } from './components/chapters-list/chapters-list.component';
import { CanvasImage1Component } from './components/canvas-image1/canvas-image1.component';
import { DoublePageReaderV2Component } from './components/double-page-reader-v2/double-page-reader-v2.component';
import { DoublePageReaderV2DefaultComponent } from './components/double-page-reader-v2-default/double-page-reader-v2-default.component';

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
    ReaderNavbarBarComponent,
    ReaderSectionComponent,
    OnePageReaderComponent,
    MultiplePageReaderMode1Component,
    MultiplePageReaderMode3Component,
    MultiplePageReaderMode2Component,
    ReaderChangeComponent,
    CustomGridComponent,
    ToolbarOptionComponent,
    SetChapterFirstPageCoverComponent,
    ChaptersListComponent,
    CanvasImage1Component,
    DoublePageReaderV2Component,
    DoublePageReaderV2DefaultComponent
  ],
  imports: [
    CommonModule,
    ReaderRoutingModule,
    MaterialModule,
  ]
})
export class ReaderModule { }
