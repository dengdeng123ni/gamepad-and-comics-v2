import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DetailRoutingModule } from './detail-routing.module';
import { IndexComponent } from './pages/index/index.component';
import { ComicsInfoComponent } from './components/comics-info/comics-info.component';
import { ChapterListMode1Component } from './components/chapter-list-mode1/chapter-list-mode1.component';
import { MaterialModule } from 'src/app/library/material.module';
import { ChapterListMode2Component } from './components/chapter-list-mode2/chapter-list-mode2.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { ExportSettingsComponent } from './components/export-settings/export-settings.component';
import { EditToolbarComponent } from './components/edit-toolbar/edit-toolbar.component';


@NgModule({
  declarations: [
    IndexComponent,
    ComicsInfoComponent,
    ChapterListMode1Component,
    ChapterListMode2Component,
    ToolbarComponent,
    ExportSettingsComponent,
    EditToolbarComponent
  ],
  imports: [
    CommonModule,
    DetailRoutingModule,
    MaterialModule
  ]
})
export class DetailModule { }
