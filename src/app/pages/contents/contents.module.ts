import { NgModule } from '@angular/core';

import { ContentsRoutingModule } from './contents-routing.module';
import { FinderExplorerComponent } from './finder-explorer/finder-explorer.component';
import { FinderCriteriaComponent } from './finder-criteria/finder-criteria.component';
import { PreviewComponent } from './preview/preview.component';
import { ContentsComponent } from './contents.component';
import { ThemeModule } from 'src/app/@theme/themes.module';
import { CalendarComponent } from './calendar/calendar.component';
import { AnnotationComponent } from './annotation/annotation.component';
import { FinderTimelineComponent } from './finder-timeline/finder-timeline.component';

const COMPONENTS = [
  FinderExplorerComponent,
  FinderCriteriaComponent,
  PreviewComponent,
  ContentsComponent,
  CalendarComponent,
  AnnotationComponent,
  FinderTimelineComponent,
];

@NgModule({
  imports: [
    ThemeModule,
    ContentsRoutingModule
  ],
  declarations: [...COMPONENTS]
})
export class ContentsModule { }
