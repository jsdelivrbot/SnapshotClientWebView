import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContentsRoutingModule } from './contents-routing.module';
import { FinderExplorerComponent } from './finder-explorer/finder-explorer.component';
import { FinderCriteriaComponent } from './finder-criteria/finder-criteria.component';
import { PreviewComponent } from './preview/preview.component';
import { ContentsComponent } from './contents.component';

const COMPONENTS = [
  FinderExplorerComponent,
  FinderCriteriaComponent,
  PreviewComponent,
];

@NgModule({
  imports: [
    CommonModule,
    ContentsRoutingModule
  ],
  declarations: [...COMPONENTS, ContentsComponent]
})
export class ContentsModule { }
