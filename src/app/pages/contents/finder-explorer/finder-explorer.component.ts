import { Component, OnInit } from '@angular/core';
import { Category, Content } from 'src/app/@core/data';
import { DeliveryService } from 'src/app/@core/service/delivery.service';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-finder-explorer',
  templateUrl: './finder-explorer.component.html',
  styleUrls: ['./finder-explorer.component.scss']
})
export class FinderExplorerComponent implements OnInit {

  /**
   * カテゴリの分割リストの項目配列
   *
   * 各要素が分割リストUIコンテナの1つのコンテナと対応します。
   */
  explorerSplitedListItems: ExplorerSplitCategoryListItem[] = [];

  /**
   *
   */
  contentListPageItem: ContentListPageItem[] = [];

  /** 選択中のカテゴリID */
  selectedCategoryId: number;

  server: string;

  /**
   * コンストラクタ
   *
   * @param delivery
   * @param router
   */
  constructor(
    private delivery: DeliveryService,
    private router: Router,
  ) {
    this.server = environment.server;
  }

  ngOnInit() {
    this.loadCategoryChildren(1);
  }

  /**
   *
   * @param item
   */
  selectedListItem(item: Category) {
    this.loadCategoryChildren(item.id);
  }

  /**
   *
   * @param item
   */
  selectedListItemDisplayContent(item: Category) {
    this.selectedCategoryId = item.id;
    this.loadContentListByCategory(item.id);
  }

  /**
   * プレビュー画面を表示します
   */
  showPreview(item: ContentListPageItem, position: number) {
    this.delivery.readableCategory(this.selectedCategoryId).pipe(take(1)).subscribe(result => {
      this.router.navigate(['pages', 'contents', 'preview', this.selectedCategoryId, position]);
    });
  }

  /**
   * カテゴリの次回コンテント表示設定からプレビュー画面を表示します
   */
  showPreviewFromCategory(item: Category) {
    if (item.nextDisplayContentId != null) {
      this.delivery.loadCategoryContents(item.id).pipe(take(1))
        .subscribe((result) => {
          let position: number = result.findIndex(prop => prop.id == item.nextDisplayContentId);
          position = position + 1;
          if (position <= 0) position = 0;

          this.delivery.readableCategory(item.id).pipe(take(1)).subscribe(result => {
            this.router.navigate(['pages', 'contents', 'preview', item.id, position]);
          });
        });
    }
  }

  private loadContentListByCategory(categoryId: number) {
    this.contentListPageItem = [];
    this.delivery.loadCategoryContents(categoryId).pipe(take(1))
      .subscribe((result) => {
        result.forEach((inprop) => {
          let item: ContentListPageItem = {
            content: inprop,
            thumbnailUrl: this.server + "/api/bff/resource/thumbnail/" + inprop.thumbnailKey,
          };
          this.contentListPageItem.push(item);
        });
      });
  }

  private loadCategoryChildren(categoryId: number) {
    this.delivery.loadCategoryTree(categoryId).pipe(take(1))
      .subscribe((result) => {
        if (result.length == 0) // 追加項目がない場合は処理しない
          return;

        let targetItems: ExplorerSplitCategoryListItem[] = this.explorerSplitedListItems;

        let index = this.explorerSplitedListItems.findIndex((prop) => {
          if (prop.items != null && prop.items.findIndex((prop2: Category) => prop2.id === categoryId) > -1) return true;
          return false;
        });

        // 更新対象がリストの末尾の場合は、新たな要素をリストへ追加する
        if (index + 1 == this.explorerSplitedListItems.length) {
          // 新たな要素を末尾に追加する
          let item: ExplorerSplitCategoryListItem = {
            categoryId: categoryId,
            items: result,
            pageNo: 1,
          };
          this.pagination(item);
          targetItems.push(item);
        } else if (index == undefined) {
          // リストの要素をクリアして、新たなリストを作成する
          let item: ExplorerSplitCategoryListItem = {
            categoryId: categoryId,
            items: result,
            pageNo: 1,
          };
          this.pagination(item);
          let newArray = [];
          newArray.push(item);
          targetItems = newArray;
        } else {
          // indexより大きい要素を削除する
          // index位置の要素を更新する。
          let newArray = this.explorerSplitedListItems.slice(0, index + 2);
          let lastItem: ExplorerSplitCategoryListItem = newArray[newArray.length - 1];
          lastItem.items = result;
          targetItems = newArray;
        }
        this.explorerSplitedListItems = targetItems;
      });
  }

  private pagination(item: ExplorerSplitCategoryListItem) {
    this.delivery.loadCategoryTreeTotal(item.categoryId).pipe(take(1)).subscribe(result => {
      let pageNo: number = item.pageNo;
      item.total = result.total;
      item.windowSize = result.windowSize;
      if (pageNo > result.page) {
        pageNo = result.page;
      }
      item.pageNo = pageNo;
    });
  }
}

/**
 * カテゴリリストコンテナの項目クラス
 */
export interface ExplorerSplitCategoryListItem {

  /**
   * 親カテゴリのID
   */
  categoryId: number;

  /**
   * リストに表示するカテゴリ一覧
   */
  items: Category[];

  pageNo?: number;

  total?: number;

  windowSize?: number;
}

/**
 * コンテント一覧の項目クラス
 */
export interface ContentListPageItem {
  thumbnailUrl: string;
  content: Content;
}
