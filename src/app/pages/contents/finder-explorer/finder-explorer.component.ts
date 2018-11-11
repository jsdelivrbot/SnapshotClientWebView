import { Component, OnInit } from '@angular/core';
import { Category, Content } from 'src/app/@core/data';

@Component({
  selector: 'app-finder-explorer',
  templateUrl: './finder-explorer.component.html',
  styleUrls: ['./finder-explorer.component.scss']
})
export class FinderExplorerComponent implements OnInit {

  /**
   * エクスプローラー画面の分割リストです
   *
   * 各要素が分割リストUIコンテナの1つのコンテナと対応します。
   */
  explorerSplitedListItems: ExplorerSplitCategoryListItem[] = [];

  constructor() { }

  ngOnInit() {
  }

  /**
   *
   * @param item
   */
  selectedListItem(item: any) {
  }

  /**
   *
   */
  selectedListItemDisplayContent(item: any) {
  }

  /**
   * プレビュー画面を表示します
   */
  showPreview(item: ContentListPageItem, position: number) {
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
