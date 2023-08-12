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

const dbConfig: DBConfig = {
  name: 'db',
  version: 7,
  objectStoresMeta: [
    {
      store: 'comics',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'id', keypath: 'id', options: { unique: false } },
      ]
    },
    {
      store: 'chapter',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'id', keypath: 'id', options: { unique: false } },
      ]
    },
    {
      store: 'chapter_ce',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'id', keypath: 'id', options: { unique: false } },
      ]
    },
    {
      store: 'images',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'id', keypath: 'id', options: { unique: false } },
      ]
    },
    {
      store: 'comics_config',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'id', keypath: 'id', options: { unique: false } },
      ]
    },
    {
      store: 'last_read_comics',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'id', keypath: 'id', options: { unique: false } },
      ]
    },
    {
      store: 'last_read_chapter',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'id', keypath: 'id', options: { unique: false } },
      ]
    },
  ]
};

@NgModule({
  declarations: [
    AppComponent
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
    ListModule,
    DetailModule,
    ReaderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
