import { Component, OnInit, AfterViewInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { DeliveryService } from 'src/app/@core/service/delivery.service';
import { Content, Label } from 'src/app/@core/data';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { ViewModelService } from 'src/app/@core/service/view-model.service';
import { take, throttle } from 'rxjs/operators';
import { fromEvent, interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit, OnDestroy {

  /**  */
  previewContent: Content | null = null;

  /** プレビュー画面の画像URL */
  previewUrl: SafeUrl = null;

  /** */
  previewCategoryLabels: Array<Label> = [];

  currentCategoryId: number = 0;

  currentPageNo: number = 0;

  totalPageNo: number = 0;

  fitMode: boolean = false;

  /** イベントログ */
  currentEventLogId: number | null = null;

  beforePreviewContentId: number | null = null;

  /**
   * テンプレートから「#pain」でマークしているng-templateを取得する
   */
  @ViewChild('pain')
  pain: TemplateRef<any> = null;

  /**
   * コンストラクタ
   *
   * @param delivery
   * @param route
   */
  constructor(
    private delivery: DeliveryService,
    private viewmodel: ViewModelService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
  ) { }
  ngOnInit() {
    this.viewmodel.screenStatus.pain = this.pain;

    this.route.paramMap.subscribe((map: ParamMap) => {
      let categoryId: number = +map.get('categoryId');
      let position: number = +map.get('position');

      this.currentCategoryId = categoryId;
      this.currentPageNo = position;

      this.delivery.loadCategoryContentsPreview(categoryId, position).pipe(take(1)).subscribe((content) => {
        this.previewContent = content;
        this.previewUrl = this.sanitizer.bypassSecurityTrustUrl(content.previewFileUrl);

        this.delivery.loadCategory(categoryId).pipe(take(1)).subscribe((category) => {
          if (category.labels != null) { //
            this.previewCategoryLabels = category.labels;
          } else {
            this.previewCategoryLabels = [];
          }
        });
        this.delivery.loadCategoryContentsTotal(categoryId).pipe(take(1)).subscribe((pagenation) => {
          this.totalPageNo = pagenation.total;
        });

        if (this.currentEventLogId != null) {
          // プレビュー非表示イベントを、プレビュー表示イベントログに追加する。
          this.delivery.updatePreviewHideEventLog(this.currentEventLogId).pipe(take(1)).subscribe();
        }

        // プレビュー表示イベントログ
        console.log("登録するコンテントID", content.id);
        this.delivery.registerPreviewEventLog(content.id).pipe(take(1)).subscribe((eventlog) => {
          this.currentEventLogId = eventlog.id;
          if (this.beforePreviewContentId != null) {
            this.delivery.updatePreviewHideEventLog(this.currentEventLogId, this.beforePreviewContentId).pipe(take(1)).subscribe();
          }
          this.beforePreviewContentId = content.id;
        });
      });
    });

    this.resizeObservableSubscription = this.resizeObservable.subscribe(() => this.refresh());
  }
  private resizeObservable = fromEvent(window, 'resize').pipe(throttle(() => interval(200)));
  private resizeObservableSubscription: Subscription = null;

  ngOnDestroy() {
    this.viewmodel.screenStatus.pain = null;
    this.resizeObservableSubscription.unsubscribe();

    // プレビュー非表示イベントを、プレビュー表示イベントログに追加する。
    this.delivery.updatePreviewHideEventLog(this.currentEventLogId).pipe(take(1)).subscribe();
  }

  /**
   *
   */
  nextItem() {
    if (this.currentPageNo + 1 > this.totalPageNo) return;
    this.navigation(this.currentPageNo + 1);
  }

  /**
   *
   */
  prevItem() {
    if (this.currentPageNo - 1 <= 0) return;
    this.navigation(this.currentPageNo - 1);
  }

  /**
   * ラベル検索を表示します
   *
   * @param label ラベル
   */
  showCriteria(label: Label) {
    this.router.navigate(['pages', 'contents', 'criteria', label.id]);
  }

  changeFittingMode() {
    this.fitMode = !this.fitMode;
    console.log("FitMode", this.fitMode);
  }

  refresh() {
    this.fitMode = true;
    setTimeout(() => this.fitMode = false, 1);
  }

  /**
   *
   * @param page
   */
  private navigation(page: number) {
    this.router.navigate(['pages', 'contents', 'preview', this.currentCategoryId, page]);
  }
}
