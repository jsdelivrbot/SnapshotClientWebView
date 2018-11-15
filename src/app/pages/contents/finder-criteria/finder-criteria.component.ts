import { Component, OnInit } from '@angular/core';
import { Label, Category, Content } from 'src/app/@core/data';
import { DeliveryService } from 'src/app/@core/service/delivery.service';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { PreviewComponent } from '../preview/preview.component';

@Component({
  selector: 'app-finder-criteria',
  templateUrl: './finder-criteria.component.html',
  styleUrls: ['./finder-criteria.component.scss']
})
export class FinderCriteriaComponent implements OnInit {

  criteriaSplitedListItems: Array<CriteriaSplitCategoryListItem> = [];

  categoryListPageItem: CategoryListPageItem[] = [];

  contentListPageItem: ContentListPageItem[] = [];

  selectedCategoryId: number;

  /**
   *
   * @param delivery
   */
  constructor(
    private delivery: DeliveryService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.loadLabel();
  }

  /**
   *
   * @param listItem
   * @param item
   */
  selectedListItem(listItem: CriteriaSplitCategoryListItem, item: CriteriaSplitCategoryLabelItem) {
    listItem.selectedLabelId = item.label.Id;

    let index = this.criteriaSplitedListItems.findIndex((prop) => prop === listItem);
    if (!item.isActive) {
      if (index + 1 == this.criteriaSplitedListItems.length) {
        this.loadLabel();
      }
    } else {
      // 末端ではない場合のみ
      if (index + 1 != this.criteriaSplitedListItems.length) {
        this.criteriaSplitedListItems = this.criteriaSplitedListItems.filter(prop => prop !== listItem);
      }
    }

    listItem.labelItems.forEach(prop => prop.isActive = false);
    item.isActive = true;

    let activeLabelList: Label[] = [];
    this.criteriaSplitedListItems.forEach(prop => {
      if (prop.selectedLabelId == 0) return;
      let litem: Label = { Id: prop.selectedLabelId, Name: "", HasLinkSubLabelFlag: false }
      activeLabelList.push(litem);
    });

    this.categoryListPageItem = [];
    this.delivery.findCategoryByLabel(activeLabelList).subscribe(result => {
      console.log("レスポンス", result);
      for (let cat of result) {
        let item: CategoryListPageItem = {
          category: cat,
          ThumbnailUrl: 'https://kbdevstorage1.blob.core.windows.net/asset-blobs/19964_en_1'
        };
        this.categoryListPageItem.push(item);
      }
    });
  }

  /**
   * カテゴリを選択します
   *
   * @param listItem
   */
  selectCategoryListItem(listItem: CategoryListPageItem) {
    this.selectedCategoryId = listItem.category.Id;
    this.loadContentListByCategory(listItem.category.Id);
  }

  /**
   * プレビュー画面を表示します
   *
   * @param item
   * @param position
   */
  showPreview(item: ContentListPageItem, position: number) {
    this.router.navigate([...PreviewComponent.PATH, this.selectedCategoryId, position]);
  }

  private loadLabel() {
    this.delivery.loadLabels().pipe(take(1))
      .subscribe((labels) => {
        if (labels.length == 0) // 追加項目がない場合は処理しない
          return;

        let labelItemArray = new Array<CriteriaSplitCategoryLabelItem>();
        for (let ii of labels) {
          labelItemArray.push({
            isActive: false,
            label: ii
          });
        }

        let targetItems: CriteriaSplitCategoryListItem[] = this.criteriaSplitedListItems;
        let item: CriteriaSplitCategoryListItem = {
          selectedLabelId: 0, // 初期値は「0」とする。
          labelItems: labelItemArray,
        };
        targetItems.push(item);
        this.criteriaSplitedListItems = targetItems;
      });
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

    //this.selectedCategoryId = categoryId;
  }
}

/**
 * ラベルリストコンテナの項目クラス
 */
export interface CriteriaSplitCategoryListItem {

  /**
   * 選択ラベルID
   */
  selectedLabelId: number;

  /**
   * リストに表示するラベル一覧
   */
  labelItems: CriteriaSplitCategoryLabelItem[];
}

export interface CriteriaSplitCategoryLabelItem {
  label: Label;
  isActive: boolean;
}

/**
 * カテゴリ一覧の項目クラス
 */
export interface CategoryListPageItem {
  category: Category;
  ThumbnailUrl: string;
}

/**
 * コンテント一覧の項目クラス
 */
export interface ContentListPageItem {
  ThumbnailUrl: string;
  Content: Content;
}
