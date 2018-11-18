import { Component } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';

@Component({
  selector: 'app-pages',
  template: `
  <app-main-layout>
    <nb-menu [items]="menu"></nb-menu>
    <router-outlet></router-outlet>
  </app-main-layout>
  `
})
export class PagesComponent {
  menu: NbMenuItem[] = [
    {
      title: 'カテゴリ一覧',
      icon: 'nb-e-commerce',
      link: '/pages/contents/explorer',
      home: true,
    },
    {
      title: 'ラベル検索',
      icon: 'nb-e-commerce',
      link: '/pages/contents/criteria',
      home: true,
    },
    {
      title: 'プレビュー',
      icon: 'nb-e-commerce',
      link: '/pages/contents/preview',
      home: true,
    },
  ];
}
