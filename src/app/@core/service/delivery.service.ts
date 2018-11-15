import { Injectable } from '@angular/core';
import { Category, Content, Label } from '../data';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClientService } from './http-client.service';
import { HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { PagenationEntity } from '../api';

@Injectable()
export class DeliveryService {

  isPagenation = (item: any): item is PagenationEntity => item.total !== undefined;

  constructor(
    private http: HttpClientService
  ) { }

  /**
   *
   * @param categoryId
   */
  loadCategory(categoryId: number): Observable<Category> {
    return this.http.send('/api/category/' + categoryId, null);
  }

  /**
   * カテゴリの小階層カテゴリ一覧を取得します。
   *
   * @param parentCategoryId カテゴリID
   */
  loadCategoryTree(parentCategoryId: number): Observable<Category[]> {
    return this.http.send('/api/category/tree/' + parentCategoryId, null);
  }

  /**
   * カテゴリに含まれるコンテント一覧を取得します。
   *
   * @param categoryId カテゴリID
   */
  loadCategoryContents(categoryId: number): Observable<Content[]> {
    return this.http.send('/api/category/' + categoryId + '/contents', null);
  }

  /**
   * カテゴリのコンテントリストのページネーション情報を取得します。
   *
   * @param categoryId カテゴリID
   */
  loadCategoryContentsTotal(categoryId: number): Observable<PagenationEntity> {
    let url = '/api/category/' + categoryId + '/contents/total';
    return this.http.send(url, null)
      .pipe(
        map((res) => {
          if (this.isPagenation(res)) {
            return res;
          } else {
            throw new Error(url + " APIの結果を正常に読み込むことができませんでした。型が不正です。");
          }
        })
      );
  }

  /**
   * カテゴリのコンテントリスト内での任意位置のコンテント情報を取得します。
   *
   * @param categoryId カテゴリID
   * @param position 表示する項目のカテゴリ内での位置
   */
  loadCategoryContentsPreview(categoryId: number, position: number): Observable<Content> {
    let url = '/api/category/' + categoryId + '/contents/preview/' + position;
    return this.http.send(url, null);
  }

  /**
   *
   */
  loadLabels(): Observable<Label[]> {
    return this.http.send('/api/labels', null);
  }

  /**
   *
   * @param label
   */
  findCategoryByLabel(label: Label[]): Observable<Category[]> {
    let labelIdList: number[] = [];
    label.forEach(prop => labelIdList.push(prop.Id));

    let url = '/api/categories/' + labelIdList.join(',');
    console.log("リクエスト", url);

    return this.http.send(url, null);
  }
}
