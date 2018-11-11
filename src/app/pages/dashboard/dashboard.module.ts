import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { ThemeModule } from 'src/app/@theme/themes.module';
import { DashboardRoutingModule } from './dashboard-routing.module';

@NgModule({
  imports: [
    ThemeModule,
    DashboardRoutingModule,
  ],
  declarations: [DashboardComponent]
})
export class DashboardModule { }
