import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListRoutingModule } from './list-routing.module';
import { IndexComponent } from './pages/index/index.component';
import { MaterialModule } from 'src/app/library/material.module';
import { ComicsListComponent } from './components/comics-list/comics-list.component';
import { MenuComponent } from './components/menu/menu.component';
import { QueryComponent } from './components/query/query.component';
import { BookmarksComponent } from './components/bookmarks/bookmarks.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { EditToolbarComponent } from './components/edit-toolbar/edit-toolbar.component';
import { ComicsOptionComponent } from './components/comics-option/comics-option.component';
import { ComicsQueryTypeComponent } from './components/comics-query-type/comics-query-type.component';
import { ComicsFavoritesComponent } from './components/comics-favorites/comics-favorites.component';
import { ComicsSelectTypeComponent } from './components/comics-select-type/comics-select-type.component';


@NgModule({
  declarations: [
    IndexComponent,
    ComicsListComponent,
    MenuComponent,
    QueryComponent,
    BookmarksComponent,
    ToolbarComponent,
    EditToolbarComponent,
    ComicsOptionComponent,
    ComicsQueryTypeComponent,
    ComicsFavoritesComponent,
    ComicsSelectTypeComponent
  ],
  imports: [
    CommonModule,
    ListRoutingModule,
    MaterialModule
  ]
})
export class ListModule { }
