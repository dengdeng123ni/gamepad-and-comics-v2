import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ListModule } from './pages/list/list.module';
import { NgxIndexedDBModule } from 'ngx-indexed-db';
import { DBConfig } from "ngx-indexed-db";
import { HttpClientModule } from '@angular/common/http';
import { DetailModule } from './pages/detail/detail.module';
import { ReaderModule } from './pages/reader/reader.module';
import { ContextMenuComponent } from './library/public-api';
import { MaterialModule } from './library/material.module';
import { SelectDataSourceComponent } from './library/select-data-source/select-data-source.component';
import { GamepadLeftCircleToolbarComponent } from './library/event/gamepad-left-circle-toolbar/gamepad-left-circle-toolbar.component';

const dbConfig: DBConfig = {
  name: 'db',
  version: 14,
  objectStoresMeta: [
    {
      store: 'local_comics',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'id', keypath: 'id', options: { unique: false } },
      ]
    },
    {
      store: 'local_chapters',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'id', keypath: 'id', options: { unique: false } },
      ]
    },
    {
      store: 'local_pages',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'id', keypath: 'id', options: { unique: false } },
      ]
    },
    {
      store: 'read_comics_chapter',
      storeConfig: { keyPath: 'comics_id', autoIncrement: false },
      storeSchema: [
        { name: 'comics_id', keypath: 'comics_id', options: { unique: false } },
      ]
    },
    {
      store: 'read_comics',
      storeConfig: { keyPath: 'comics_id', autoIncrement: false },
      storeSchema: [
        { name: 'comics_id', keypath: 'comics_id', options: { unique: false } },
      ]
    },
    {
      store: 'comics_config',
      storeConfig: { keyPath: 'comics_id', autoIncrement: false },
      storeSchema: [
        { name: 'comics_id', keypath: 'comics_id', options: { unique: false } },
      ]
    },
    {
      store: 'last_read_comics',
      storeConfig: { keyPath: 'comics_id', autoIncrement: false },
      storeSchema: [
        { name: 'comics_id', keypath: 'comics_id', options: { unique: false } },
      ]
    },
    {
      store: 'last_read_chapter_page',
      storeConfig: { keyPath: 'chapter_id', autoIncrement: false },
      storeSchema: [
        { name: 'chapter_id', keypath: 'chapter_id', options: { unique: false } },
      ]
    },
    {
      store: 'chapter_first_page_cover',
      storeConfig: { keyPath: 'chapter_id', autoIncrement: false },
      storeSchema: [
        { name: 'chapter_id', keypath: 'chapter_id', options: { unique: false } },
      ]
    },
    {
      store: 'image',
      storeConfig: { keyPath: 'image_id', autoIncrement: false },
      storeSchema: [
        { name: 'image_id', keypath: 'image_id', options: { unique: false } },
      ]
    }
  ]
};

@NgModule({
  declarations: [
    AppComponent,
    ContextMenuComponent,
    SelectDataSourceComponent,
    GamepadLeftCircleToolbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgxIndexedDBModule.forRoot(dbConfig),
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    MaterialModule,
    ListModule,
    DetailModule,
    ReaderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
