import { Component, OnInit, OnDestroy } from '@angular/core';
import { Label, Category, Content } from 'src/app/@core/data';
import { DeliveryService } from 'src/app/@core/service/delivery.service';
import { take } from 'rxjs/operators';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { String, StringBuilder } from 'typescript-string-operations';

@Component({
  selector: 'app-finder-criteria',
  templateUrl: './finder-criteria.component.html',
  styleUrls: ['./finder-criteria.component.scss']
})
export class FinderCriteriaComponent implements OnInit, OnDestroy {

  criteriaSplitedListItems: Array<CriteriaSplitCategoryListItem> = [];

  categoryListPageItem: CategoryListPageItem[] = [];

  contentListPageItem: ContentListPageItem[] = [];

  selectedCategoryId: number;

  /** ラベルリスト */
  labels: Label[] = [];

  routerParamMapSubscription: Subscription;

  /**
   *
   * @param delivery
   */
  constructor(
    private delivery: DeliveryService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.delivery.loadLabels().pipe(take(1))
      .subscribe((labels) => {
        console.log("Label Loaded", labels);
        this.labels = labels;

        if (this.labels.length > 0) {
          // URLからパラメータを取得する
          this.routerParamMapSubscription = this.route.paramMap.subscribe((map: ParamMap) => {
            this.criteriaSplitedListItems = [];

            let labelsText: string = map.get('cond_labels');
            if (labelsText == null) {
              this.addLabelSelectContainerItem();
              return;
            }

            let labelIds: string[] = labelsText.split(",");
            labelIds.forEach((labelId: string) => this.addLabelSelectContainerItem(+labelId));
            this.addLabelSelectContainerItem(); // 末尾に空の項目を追加する

            this.searchCurrent();
          });
        } else {
          console.warn("ラベルがありません");
        }
      });
  }

  ngOnDestroy() {
    if (this.routerParamMapSubscription != null) {
      this.routerParamMapSubscription.unsubscribe();
    }
  }

  /**
   *
   * @param listItem
   * @param item
   */
  selectedListItem(listItem: CriteriaSplitCategoryListItem, item: CriteriaSplitCategoryLabelItem) {
    listItem.selectedLabelId = item.label.id;

    let index = this.criteriaSplitedListItems.findIndex((prop) => prop === listItem);
    if (!item.isActive) {
      if (index + 1 == this.criteriaSplitedListItems.length) {
        this.addLabelSelectContainerItem();
      }
    } else {
      // 末端ではない場合のみ
      if (index + 1 != this.criteriaSplitedListItems.length) {
        this.criteriaSplitedListItems = this.criteriaSplitedListItems.filter(prop => prop !== listItem);
      }
    }

    listItem.labelItems.forEach(prop => prop.isActive = false);
    item.isActive = true;

    this.contentListPageItem = [];
    this.searchCurrent();
  }

  /**
   * カテゴリを選択します
   *
   * @param listItem
   */
  selectCategoryListItem(listItem: CategoryListPageItem) {
    this.selectedCategoryId = listItem.category.id;
    this.loadContentListByCategory(listItem.category.id);
  }

  /**
   * プレビュー画面を表示します
   *
   * @param item
   * @param position
   */
  showPreview(item: ContentListPageItem, position: number) {
    this.router.navigate(['pages', 'contents', 'preview', this.selectedCategoryId, position]);
  }

  /**
   * 表示中のラベルリストの絞り込みを行います
   *
   * @param item
   */
  refineLabelList(item: CriteriaSplitCategoryListItem) {
    let labelItemArray = new Array<CriteriaSplitCategoryLabelItem>();
    for (let ii of this.labels) {
      labelItemArray.push({
        isActive: false,
        label: ii
      });
    }

    if (item.filterLabelListString == '') {
      item.labelItems = labelItemArray;
      item.applySelectedLabelActive();
    } else {
      item.labelItems = labelItemArray.filter(prop => prop.label.name.includes(item.filterLabelListString));
      item.applySelectedLabelActive();
    }
  }

  private addLabelSelectContainerItem(defaultSelectedLabelId: number = 0) {
    if (this.labels.length == 0) return;

    let labelItemArray = new Array<CriteriaSplitCategoryLabelItem>();
    for (let ii of this.labels) {
      let isActive: boolean = false;
      if (defaultSelectedLabelId > 0 && ii.id == defaultSelectedLabelId) {
        isActive = true;
      }

      labelItemArray.push({
        isActive: isActive,
        label: ii
      });
    }

    let targetItems: CriteriaSplitCategoryListItem[] = this.criteriaSplitedListItems;
    let item: CriteriaSplitCategoryListItem = new CriteriaSplitCategoryListItem();

    item.selectedLabelId = defaultSelectedLabelId;
    item.labelItems = labelItemArray;
    item.filterLabelListString = '';

    targetItems.push(item);
    this.criteriaSplitedListItems = targetItems;
  }


  /**
   * 現在の設定で検索を行います。
   */
  private searchCurrent() {
    let activeLabelList: Label[] = [];
    this.criteriaSplitedListItems.forEach(prop => {
      if (prop.selectedLabelId == 0) return;
      let litem: Label = { id: prop.selectedLabelId, name: "", hasLinkSubLabelFlag: false }
      activeLabelList.push(litem);
    });

    this.categoryListPageItem = [];
    this.delivery.findCategoryByLabel(activeLabelList).pipe(take(1)).subscribe(result => {
      for (let category of result) {
        let item: CategoryListPageItem = {
          category: category,
          thumbnailUrl: category.thumbnailImageSrcUrl
        };

        // アルバム属性のカテゴリでアートワークが未設定の場合は、
        // アートワークの設定をおこないます。
        if (category.albumFlag && String.IsNullOrWhiteSpace(category.artworkThumbnailKey)) {
          console.log("アルバム属性を持つカテゴリのアートワーク設定をリクエストします")
          this.delivery.updateArtwork(category.id).pipe(take(1)).subscribe(category => {
            item.thumbnailUrl = category.thumbnailImageSrcUrl;
            console.log("カテゴリのサムネイルを設定します。", item.thumbnailUrl);
          });
        }

        console.log("カテゴリ一覧", item);
        this.categoryListPageItem.push(item);
      }
    });
  }

  private loadContentListByCategory(categoryId: number) {
    this.contentListPageItem = [];
    this.delivery.loadCategoryContents(categoryId).pipe(take(1))
      .subscribe((result) => {
        result.forEach((inprop) => {
          let item: ContentListPageItem = {
            content: inprop,
            thumbnailUrl: inprop.thumbnailImageSrcUrl,
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
export class CriteriaSplitCategoryListItem {

  applySelectedLabelActive() {
    this.labelItems.forEach(prop => {
      if (prop.label.id == this.selectedLabelId)
        prop.isActive = true;
      else
        prop.isActive = false;
    })
  }

  /**
   * 選択ラベルID
   */
  selectedLabelId: number;

  /** ラベルリストの絞り込み文字列 */
  filterLabelListString: string;

  /**
   * リストに表示するラベル一覧
   */
  labelItems: CriteriaSplitCategoryLabelItem[] = [];
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
  thumbnailUrl: string;
}

/**
 * コンテント一覧の項目クラス
 */
export interface ContentListPageItem {
  thumbnailUrl: string;
  content: Content;
}
