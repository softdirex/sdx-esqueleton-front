import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PaginatorConfig } from '../../config/paginator-config';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Commons, FILTER } from '../../Commons';

/**
 * Add declarations of PaginatorComponent in LayoutModule or AppModule
 * 
 * You can add html:
 * 
 <div *ngIf="!loading" class="row justify-content-center">
    <app-paginator [filtersInSelect]="filtersInSelect" [paginator]="paginator"
              (paginatorChange)="onPageSelected($event)"></app-paginator>
  </div>
 * In TS you needs add:
  paginator: PaginatorConfig = new PaginatorConfig()
  filtersInSelect: FILTER[] = []

  ngOnInit(): void {
    this.paginator.limit = this.paginator.sizes[0]
    this.loadData()
  }
 
  onPageSelected(paginator: PaginatorConfig){
    this.paginator = paginator
    this.loadData()
  }
 * 
 * Add in suscriber:
 *      // BEGIN - Update paginator
        this.paginator.total = v.meta.total
        this.paginator.firstPage = v.meta.first_page
        this.paginator.lastPage = v.meta.last_page
        this.paginator.currentPage = v.meta.current_page
        this.paginator.currentSizes = this.paginator.sizes.filter(num => num <= this.paginator.total);
        this.paginator.currentSizes.length > 0 && this.paginator.currentSizes[this.paginator.currentSizes.length - 1] < this.paginator.total ? this.paginator.currentSizes.push(this.paginator.sizes.find(num => num > this.paginator.total)!) : null;
        // END - Update paginator
 */
@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.css',
  providers: []
})
export class PaginatorComponent implements OnInit {

  isMobile = false;
  @Input() filtersInSelect: FILTER[] = []
  @Input() paginator: PaginatorConfig = new PaginatorConfig()
  @Output() paginatorChange: EventEmitter<PaginatorConfig> = new EventEmitter<PaginatorConfig>();

  constructor(
    private breakpointObserver: BreakpointObserver,
  ) {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      this.isMobile = result.matches;
    });
  }


  ngOnInit(): void {
    this.buildFiltersTag()
    this.buildPaginator()
  }

  buildFiltersTag() {
    this.paginator.filtersTag = ''
    for (let item of this.filtersInSelect) {
      if (item.enabled) {
        this.paginator.filtersTag = this.paginator.filtersTag + item.field + Commons.F_EQUAL + item.value + Commons.F_SEPARATOR
      }
    }
    this.paginator.filtersTag = this.paginator.filtersTag.slice(0, -2)
    if (this.paginator.filtersTag == '') {
      this.paginator.filtersTag = null
    }
  }

  buildPaginator() {
    let maxToView: number = 2
    if (this.isMobile) {
      maxToView = 1
    }
    this.paginator.allPages = []
    let lastInsert: boolean = false
    for (let index = 0; index < this.paginator.lastPage; index++) {
      if (this.paginator.page - (maxToView + 1) == index + 1) {
        this.paginator.allPages = []
        this.paginator.allPages.push('...')
      } else {
        if (this.paginator.page + maxToView == index) {
          lastInsert = true
          this.paginator.allPages.push('...')
        } else {
          if (!lastInsert) {
            this.paginator.allPages.push(index + 1)
          }
        }
      }
    }
  }

  toPage(arg: number) {
    this.paginator.page = arg
    this.paginator.currentPage = arg
    this.emit()
  }

  changeLimit(arg: number) {
    this.paginator.page = 1
    this.paginator.limit = arg
    this.emit()
  }

  get showSizes():boolean{
    return this.paginator.currentSizes.length > 1
  }

  get showPaginator():boolean{
    return this.paginator.total > this.paginator.sizes[0]
  }

  emit() {
    this.paginatorChange.emit(this.paginator);
  }

}
