import { Injectable } from '@angular/core';
import { Category, Content } from '../data';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClientService } from './http-client.service';
import { HttpParams } from '@angular/common/http';

@Injectable()
export class DeliveryService {

  constructor(
    private http: HttpClientService
  ) { }

  /**
   * カテゴリの小階層カテゴリ一覧を取得します。
   *
   * @param parentCategoryId カテゴリID
   */
  loadCategoryTree(parentCategoryId: number): Observable<Category[]> {
    return this.http.send('/api/category/' + parentCategoryId, null);
  }

  /**
   * カテゴリに含まれるコンテント一覧を取得します。
   *
   * @param categoryId カテゴリID
   */
  loadCategoryContents(categoryId: number): Observable<Content[]> {
    return this.http.send('/api/category/' + categoryId + '/contents', null);
  }
}
