import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from './pages.component';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule'
    },
    {
      path: 'contents', loadChildren: './contents/contents.module#ContentsModule'
    },
    {
      path: '', redirectTo: 'dashboard'
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
