import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListRoutingModule } from './list-routing.module';
import { IndexComponent } from './pages/index/index.component';
import { MaterialModule } from 'src/app/library/material.module';
import { ComicsListComponent } from './components/comics-list/comics-list.component';
import { ToolBarComponent } from './complex-components/tool-bar/tool-bar.component';
import { MenuComponent } from './complex-components/menu/menu.component';
import { QueryComponent } from './components/query/query.component';
import { BookmarksComponent } from './components/bookmarks/bookmarks.component';


@NgModule({
  declarations: [
    IndexComponent,
    ComicsListComponent,
    ToolBarComponent,
    MenuComponent,
    QueryComponent,
    BookmarksComponent
  ],
  imports: [
    CommonModule,
    ListRoutingModule,
    MaterialModule
  ]
})
export class ListModule { }
