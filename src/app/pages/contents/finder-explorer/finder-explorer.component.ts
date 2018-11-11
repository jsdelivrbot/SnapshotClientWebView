import { Component, OnInit } from '@angular/core';
import { Category, Content } from 'src/app/@core/data';
import { DeliveryService } from 'src/app/@core/service/delivery.service';
import { take } from 'rxjs/operators';

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

  constructor(
    private delivery: DeliveryService,
  ) { }

  ngOnInit() {
    this.loadCategoryChildren(0);
  }

  /**
   *
   * @param item
   */
  selectedListItem(item: Category) {
    this.loadCategoryChildren(item.Id);
  }

  /**
   *
   * @param item
   */
  selectedListItemDisplayContent(item: Category) {
    this.loadContentListByCategory(item.Id);
  }

  /**
   * プレビュー画面を表示します
   */
  showPreview(item: ContentListPageItem, position: number) {
  }

  private loadContentListByCategory(categoryId: number) {
    this.contentListPageItem = [];
    this.delivery.loadCategoryContents(categoryId).pipe(take(1))
      .subscribe((result) => {
        result.forEach((inprop) => {
          let item: ContentListPageItem = {
            Content: inprop,
            ThumbnailUrl: inprop.ThumbnailImageSrcUrl,
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
          if (prop.items != null && prop.items.findIndex((prop2: Category) => prop2.Id === categoryId) > -1) return true;
          return false;
        });

        // 更新対象がリストの末尾の場合は、新たな要素をリストへ追加する
        if (index + 1 == this.explorerSplitedListItems.length) {
          // 新たな要素を末尾に追加する
          let item: ExplorerSplitCategoryListItem = {
            categoryId: categoryId,
            items: result
          };
          targetItems.push(item);
        } else if (index == undefined) {
          // リストの要素をクリアして、新たなリストを作成する
          let item: ExplorerSplitCategoryListItem = {
            categoryId: categoryId,
            items: result
          };
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
}

/**
 * コンテント一覧の項目クラス
 */
export interface ContentListPageItem {
  ThumbnailUrl: string;
  Content: Content;
}
