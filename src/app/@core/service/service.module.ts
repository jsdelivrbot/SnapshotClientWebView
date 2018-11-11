import { DeliveryService } from "./delivery.service";
import { NgModule, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ViewModelService } from "./view-model.service";
import { HttpClientService } from "./http-client.service";

export const SERVICES = [
  DeliveryService,
  ViewModelService,
  HttpClientService,
];

@NgModule({
  imports: [
    CommonModule,
  ],
  providers: [
    ...SERVICES,
  ],
})
export class ServiceModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: ServiceModule,
      providers: [
        ...SERVICES,
      ],
    };
  }
}
