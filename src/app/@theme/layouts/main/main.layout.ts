import { Component } from "@angular/core";
import { ViewModelService } from "src/app/@core/service/view-model.service";

@Component({
  selector: 'app-main-layout',
  styleUrls: ['./main.layout.scss'],
  templateUrl: './main.layout.html'
})
export class MainLayoutComponent {
  constructor(
    public viewmodel: ViewModelService,
  ) {

  }

}
