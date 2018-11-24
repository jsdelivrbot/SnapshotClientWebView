import { Injectable } from '@angular/core';
import { Category, Content, Label, EventLog } from '../data';
import { Observable } from 'rxjs';
import { HttpClientService } from './http-client.service';
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
    return this.http.send('/api/bff/category/' + categoryId, null);
  }

  /**
   * カテゴリの小階層カテゴリ一覧を取得します。
   *
   * @param parentCategoryId カテゴリID
   */
  loadCategoryTree(parentCategoryId: number): Observable<Category[]> {
    return this.http.send('/api/bff/category/tree/' + parentCategoryId, null);
  }

  /**
   * カテゴリに含まれるコンテント一覧を取得します。
   *
   * @param categoryId カテゴリID
   */
  loadCategoryContents(categoryId: number): Observable<Content[]> {
    return this.http.send('/api/bff/category/' + categoryId + '/contents', null);
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
    return this.http.send(url, null);
  }

  /**
   * すべてのラベルを取得します
   *
   * このAPIはページング対応とするためシグニチャ変更予定です。
   */
  loadLabels(): Observable<Label[]> {
    return this.http.send('/api/bff/labels', null);
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

    return this.http.send(url, null);
  }

  /**
   * コンテントを既読状態にします。
   *
   * @param content_id コンテントID
   */
  readabled(content_id: number): Observable<boolean> {
    return this.http.action('/api/bff/content/' + content_id + '/readable', null);
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
}
