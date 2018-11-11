import { Optional, SkipSelf, ModuleWithProviders, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ServiceModule } from "./service/service.module";

export const NB_CORE_PROVIDERS = [
  ...ServiceModule.forRoot().providers,
//  HttpClientService,
];

/**
 * コアモジュール
 */
@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
  ],
  declarations: [],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(`CoreModule has already been loaded. Import Core modules in the AppModule only.`);
    }
  }

  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: CoreModule,
      providers: [
        ...NB_CORE_PROVIDERS,
      ],
    };
  }
}
