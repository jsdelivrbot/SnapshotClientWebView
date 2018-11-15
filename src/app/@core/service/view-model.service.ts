import { Injectable, TemplateRef } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';

@Injectable()
export class ViewModelService {

  screenStatus: ScreenStatus = new ScreenStatus();

  constructor() { }

}

export class ScreenStatus {
  pain: TemplateRef<any>;
}
