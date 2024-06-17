import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { FormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { Commons, FILTER, FilterType } from 'src/app/shared/Commons';
import { PaginatorConfig } from 'src/app/shared/config/paginator-config';
import { SharedModule } from 'src/app/shared/shared.module';
import { environment } from 'src/environments/environment';

const moment = _rollupMoment || _moment;

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-common-filter',
  standalone: true,
  imports: [
    FormsModule,
    SharedModule,
    MatDatepickerModule,
    MatFormFieldModule,
    CommonModule
  ],
  providers:[
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './common-filter.component.html',
  styleUrl: './common-filter.component.css'
})
export class CommonFilterComponent {
  @Input() filtersInSelect: FILTER[] = []
  @Input() paginator: PaginatorConfig = new PaginatorConfig()
  @Output() paginatorChange: EventEmitter<PaginatorConfig> = new EventEmitter<PaginatorConfig>();
  isMobile = false;
  fForm: UntypedFormGroup = new UntypedFormGroup({})
  filterDateSelected: boolean = false
  date = new UntypedFormControl(moment());
  filterDateString: string = ''

  constructor(
    private breakpointObserver: BreakpointObserver,
  ) {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      this.isMobile = result.matches;
    });
   }

  ngOnInit(): void {
    this.initFForm()
  }

  initFForm() {
    this.fForm = new UntypedFormGroup({
      fField: new UntypedFormControl('', [Validators.required]),
      fValue: new UntypedFormControl('', [Validators.required, Validators.pattern(environment.addressRegex)])
    })
  }

  get fField() { return this.fForm.get('fField')!; }
  get fValue() { return this.fForm.get('fValue')!; }

  addFilters() {
    this.initFForm()
    this.paginator.addingFilters = true
  }

  clearFilters() {
    this.filterDateSelected = false
    this.paginator.addingFilters = false
    this.initFForm()
    for (let item of this.filtersInSelect) {
      item.value = ''
      item.enabled = false
    }
    this.initFForm()
    this.buildFiltersTag()
    this.emit()
  }

  removeFilter(field: string) {
    let countFalse = 0
    for (let item of this.filtersInSelect) {
      if (item.field == field) {
        item.value = ''
        item.enabled = false
      }
      if (item.enabled == false){
        countFalse = countFalse+1
      }
    }
    if(this.filtersInSelect.length == countFalse){
      this.paginator.addingFilters = false
    }
    this.initFForm()
    this.buildFiltersTag()
    this.emit()
  }

  applyFilter() {
    this.paginator.page = 1
    const field = this.fField.value
    for (let item of this.filtersInSelect) {
      if (item.field == field) {
        item.value = (this.filterDateSelected) ? this.filterDateString : this.fValue.value
        item.enabled = true
      }
    }
    this.initFForm()
    this.buildFiltersTag()
    this.filterDateSelected = false
    // EMISOR de variable
    this.emit()
  }

  emit(){
    this.paginatorChange.emit(this.paginator);
  }

  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value!;
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.date.setValue(ctrlValue);
    let month = normalizedMonthAndYear.month() + 1
    this.filterDateString = (month + '').padStart(2, '0') + '-' + normalizedMonthAndYear.year()
    this.fValue.setValue(this.filterDateString)
    datepicker.close();
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

  onChange(selectElement: any) {
    this.filterDateSelected = false
    for (let item of this.filtersInSelect) {
      if (item.field == selectElement.value && item.type == FilterType.DATE) {
        this.filterDateSelected = true
      }
    }
  }

}
