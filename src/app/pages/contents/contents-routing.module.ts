import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContentsComponent } from './contents.component';
import { FinderExplorerComponent } from './finder-explorer/finder-explorer.component';
import { FinderCriteriaComponent } from './finder-criteria/finder-criteria.component';
import { PreviewComponent } from './preview/preview.component';
import { CalendarComponent } from './calendar/calendar.component';
import { AnnotationComponent } from './annotation/annotation.component';
import { FinderTimelineComponent } from './finder-timeline/finder-timeline.component';

const routes: Routes = [
  {
    path: '', component: ContentsComponent,
    children: [
      { path: 'explorer', component: FinderExplorerComponent },
      { path: 'criteria', component: FinderCriteriaComponent },
      { path: 'timeline', component: FinderTimelineComponent },
      { path: 'calendar', component: CalendarComponent },
      { path: 'annotation', component: AnnotationComponent },
      { path: 'criteria/:cond_labels', component: FinderCriteriaComponent },
      { path: 'preview/:categoryId/:position', component: PreviewComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContentsRoutingModule {

}
