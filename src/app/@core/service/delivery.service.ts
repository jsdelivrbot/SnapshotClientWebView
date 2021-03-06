import { Injectable } from '@angular/core';
import { Category, Content, Label, EventLog } from '../data';
import { Observable } from 'rxjs';
import { HttpClientService } from './http-client.service';
import { map } from 'rxjs/operators';
import { PagenationEntity } from '../api';
import Utils from '../utils';

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
    return this.http.send('/api/bff/category/' + categoryId, null)
      .pipe(
        map(response => response.value)
      );
  }

  /**
   * カテゴリの小階層カテゴリ一覧を取得します。
   *
   * @param parentCategoryId カテゴリID
   */
  loadCategoryTree(parentCategoryId: number): Observable<[Category[], PagenationEntity]> {
    return this.http.send('/api/bff/category/tree/' + parentCategoryId, null)
      .pipe(
        map(response => {
          // TODO:
          var page: PagenationEntity = {
            total: 100,
            windowSize: 5,
            page: 1
          };
          return Utils.zip(response.Value, page);
        })
      );
  }

  /**
   * カテゴリの子階層カテゴリの総数を取得します。
   *
   * @param parentCategoryId 取得する子階層カテゴリ一覧の親カテゴリID
   */
  loadCategoryTreeTotal(parentCategoryId: number): Observable<PagenationEntity> {
    let url = '/api/bff/category/tree/' + parentCategoryId + '/total';
    return this.http.send(url, null)
      .pipe(
        map(response => response.value)
      )
      .pipe(
        map((res) => {
          if (this.isPagenation(res)) {
            return res;
          } else {
            throw new Error(url);
          }
        })
      );
  }

  /**
   * カテゴリに含まれるコンテント一覧を取得します。
   *
   * @param categoryId カテゴリID
   */
  loadCategoryContents(categoryId: number): Observable<Content[]> {
    return this.http.send('/api/bff/category/' + categoryId + '/contents', null)
      .pipe(
        map(response => response.value)
      );
  }

  /**
   * カテゴリのコンテントリストのページネーション情報を取得します。
   *
   * @param categoryId カテゴリID
   */
  loadCategoryContentsTotal(categoryId: number): Observable<PagenationEntity> {
    let url = '/api/bff/category/' + categoryId + '/contents/total';
    return this.http.send(url, null)
      .pipe(
        map(response => response.value)
      )
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
    let url = '/api/bff/category/' + categoryId + '/contents/preview/' + position;
    return this.http.send(url, null)
      .pipe(
        map(response => response.value)
      );
  }

  /**
   * すべてのラベルを取得します
   *
   * このAPIはページング対応とするためシグニチャ変更予定です。
   */
  loadLabels(): Observable<Label[]> {
    return this.http.send('/api/bff/labels', null)
      .pipe(
        map(response => response.value)
      );
  }

  /**
   * ラベルを条件にカテゴリリストを取得します。
   * @param label 条件とするラベル配列
   */
  findCategoryByLabel(label: Label[]): Observable<Category[]> {
    // このAPIでは、ラベルは複数指定可能とする。
    let labelIdList: number[] = [];
    label.forEach(prop => labelIdList.push(prop.id));

    let url = '/api/bff/categories/' + labelIdList.join(',');

    return this.http.send(url, null)
      .pipe(
        map(response => response.value)
      );
  }

  /**
   * コンテントを既読状態を更新します。
   *
   * @param content_id コンテントID
   */
  readableContent(content_id: number): Observable<boolean> {
    console.log("[DeliveryService]", `コンテント(${content_id})の既読状態を更新します。`);
    return this.http.action('/api/bff/content/' + content_id + '/readable', null);
  }

  /**
   * カテゴリの既読状態を更新します。
   *
   * @param category_id カテゴリ
   */
  readableCategory(category_id: number): Observable<boolean> {
    console.log("[DeliveryService]", `カテゴリ(${category_id})の既読状態を更新します。`);
    return this.http.action('/api/bff/category/' + category_id + '/readable', null);
  }

  /**
   * コンテント情報を更新します
   *
   * @param contentId コンテントID
   * @param content コンテント情報
   */
  updateContent(contentId: number, content: Content): Observable<boolean> {
    return this.http.update('/api/bff/content/' + contentId, content);
  }

  /**
   * プレビュー表示イベントログを登録します
   *
   * @param contentId
   */
  registerPreviewEventLog(contentId: number): Observable<EventLog> {
    console.log("[DeliveryService]", "プレビュー表示イベントを追加します。");
    return this.http.create('/api/bff/event' + '?contentId=' + contentId);
  }

  /**
   * プレビュー非表示をイベントログに追加します。
   * @param eventlogId
   */
  updatePreviewHideEventLog(eventlogId: number, prevContentId: number | null = null): Observable<any> {
    console.log("[DeliveryService]", "プレビュー非表示イベントを追加します。");

    let buildPrevContentId = "";
    if (prevContentId != null) {
      buildPrevContentId = '?PrevContentId=' + prevContentId;
    }

    return this.http.update('/api/bff/event/' + eventlogId + buildPrevContentId);
  }

  /**
   * カテゴリのアートワークを設定します
   *
   * @param category_id カテゴリID
   */
  updateArtwork(category_id: number): Observable<Category> {
    return this.http.action('/api/bff/category/' + category_id + '/thumbnail', null);
  }

  /**
   * カテゴリ内の次のコンテント表示位置を保存します。
   *
   * @param category_id
   * @param next_content_id
   */
  updateCategoryNextContent(category_id: number, next_content_id: number): Observable<Category> {
    return this.http.action('/api/bff/category/' + category_id + '/nextcontent/' + next_content_id);
  }
}
