import { Component, HostListener, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { LicencesService } from 'src/app/services/licences.service';
import { Commons, FILTER } from 'src/app/shared/Commons';
import { LicencesConfig } from 'src/app/shared/config/licences-config';
import { PaginatorConfig } from 'src/app/shared/config/paginator-config';
import { Licence } from 'src/app/shared/interfaces/core/licence';
import { AlertModalComponent } from 'src/app/shared/modals/alert-modal/alert-modal.component';
import { ConfirmModalComponent } from 'src/app/shared/modals/confirm-modal/confirm-modal.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent implements OnInit {

  list: Licence[] = []
  paginator: PaginatorConfig = new PaginatorConfig()
  form: FormGroup

  allSelected: boolean = false
  getScreenWidth: any;
  mobileWidth: number = Commons.MOBILE_WIDTH
  licencesConfig: LicencesConfig = new LicencesConfig()

  filtersInSelect: FILTER[] = [
    { label: 'label.code', field: 'code', value: '', enabled: false },
    { label: 'label.currency', field: 'currency', value: '', enabled: false },
    { label: 'label.description', field: 'product_description', value: '', enabled: false },
    { label: 'label.product', field: 'product_name', value: '', enabled: false }
  ]

  fForm: FormGroup = new FormGroup({})

  alertModal: MdbModalRef<AlertModalComponent> | null = null;
  confirmModal: MdbModalRef<ConfirmModalComponent> | null = null;
  modalTitle = 'label.subscriptions'

  summary: string[] = []

  types: any[] = Commons.PLAN_TYPES
  sessionNonBasic: boolean = Commons.sessionObject().customer.rol != Commons.USER_ROL_BASIC

  constructor(
    private router: Router,
    private service: LicencesService,
    private fb: FormBuilder,
    private modalService: MdbModalService,
  ) {
    this.form = this.fb.group({
      checkArray: this.fb.array([])
    })
  }

  ngOnInit(): void {
    this.getScreenWidth = window.innerWidth
    this.initFForm()
    this.loadData()
  }
  get fField() { return this.fForm.get('fField')!; }
  get fValue() { return this.fForm.get('fValue')!; }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth
  }

  initFForm() {
    this.fForm = new FormGroup({
      fField: new FormControl('', [Validators.required]),
      fValue: new FormControl('', [Validators.required, Validators.pattern(environment.addressRegex)])
    })
  }

  loadData() {
    if (this.sessionNonBasic) {
      this.service.getIndexFullMyLicence(this.paginator.status, this.paginator.page, this.paginator.limit, this.paginator.filtersTag).subscribe({
        next: async (v) => {
          this.paginator.total = v.meta.total
          this.paginator.firstPage = v.meta.first_page
          this.paginator.lastPage = v.meta.last_page
          this.paginator.currentPage = v.meta.current_page
          this.list = []
          this.list = v.data
          this.buildPaginator()
        },
        error: (e) => { this.mapServiceValidationResponse((e.error != null && e.error != undefined) ? e.error.detail : 'ERROR') },
        complete: () => { }
      })
    } else {
      this.service.getIndexMyLicence(this.paginator.status, this.paginator.page, this.paginator.limit, this.paginator.filtersTag).subscribe({
        next: async (v) => {
          this.paginator.total = v.meta.total
          this.paginator.firstPage = v.meta.first_page
          this.paginator.lastPage = v.meta.last_page
          this.paginator.currentPage = v.meta.current_page
          this.list = []
          this.list = v.data
          this.buildPaginator()
        },
        error: (e) => { this.mapServiceValidationResponse((e.error != null && e.error != undefined) ? e.error.detail : 'ERROR') },
        complete: () => { }
      })
    }
  }

  buildPaginator() {
    var maxToView: number = 2
    if (this.getScreenWidth < this.mobileWidth) {
      maxToView = 1
    }
    this.paginator.allPages = []
    var lastInsert: boolean = false
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

  openModal(title: string, message: string, icon: string) {
    this.alertModal = this.modalService.open(AlertModalComponent, {
      data: { title: title, message: message, icon: icon },
    })
  }

  private mapServiceValidationResponse(detail: any) {
    detail = (detail != undefined && detail != null) ? detail : 'ERROR'
    switch (detail) {
      case 'Product is wrong':
        this.openModal(this.modalTitle, 'label.unavailable-product', Commons.ICON_WARNING)
        break;
      case 'Exceed the maximum number of filters':
        this.openModal('validations.filters', 'validations.filters-exceed', Commons.ICON_WARNING)
        break;
      default:
        this.openModal('label.unknown-error', 'label.unknown-error-contact-retry', Commons.ICON_ERROR)
        break;
    }
  }

  private mapSummaryValidationResponse(detail: any) {
    detail = (detail != undefined && detail != null) ? detail : 'ERROR'
    switch (detail) {
      case 'Invalid country name':
        this.addSummary('validations.invalid-country')
        break;
      case 'Company contains active customers':
        this.addSummary('validations.company-active-customers')
        break;
      case 'wrong privilege to delete inactive':
        this.addSummary('validations.wrong-privilege')
        break
      default:
        this.addSummary('label.unknown-error-contact-retry')
        break;
    }
  }

  addSummary(detail: string) {
    const index = this.summary.indexOf(detail, 0);
    if (index == -1) {
      this.summary.push(detail)
    }
  }

  removeSummary(detail: string) {
    const index = this.summary.indexOf(detail, 0);
    if (index > -1) {
      this.summary.splice(index, 1);
    }
  }

  toPage(arg: number) {
    this.deselectAll()
    this.paginator.page = arg
    this.loadData()
  }

  changeLimit(arg: number) {
    this.deselectAll()
    this.paginator.page = 1
    this.paginator.limit = arg
    this.loadData()
  }

  deselectAll() {
    this.form = this.fb.group({
      checkArray: this.fb.array([])
    })
    this.allSelected = false
  }


  purchase(licence: any) {
    this.router.navigate([Commons.PATH_PURCHASE + '/' + licence.code + '-' + licence.id])
  }

  add() {
    this.router.navigate([Commons.PATH_MAIN])
  }

  /**
   * Requires toStringCheckbox method
   * @param e 
   */
  onCheckboxChange(e:any) {
    const checkArray: FormArray = this.form.get('checkArray') as FormArray;
    if (e.target.checked) {
      checkArray.push(new FormControl(e.target.value));
      if (checkArray.length == this.list.length) {
        this.allSelected = true
      }
    } else {
      let i: number = 0;
      checkArray.controls.forEach((item) => {
        if (item.value == e.target.value) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  toStringCheckbox(arg: any) {
    return JSON.stringify(arg)
  }

  deleteSelected() {
    this.confirmModal = this.modalService.open(ConfirmModalComponent, {
      data: { title: this.modalTitle, message: 'label.action-confirm', icon: Commons.ICON_WARNING },
    })
    this.confirmModal.onClose.subscribe((accept: any) => {
      if (accept) {
        this.paginator.loading = true
        var selected: Licence[] = new Array()
        for (let item of this.form.value.checkArray) {
          selected.push(JSON.parse(item))
        }
        const total = selected.length
        var cont = 0
        for (let item of selected) {
          this.service.deleteMyLicence(item.id).subscribe({
            next: async (v) => {
              cont++
              if (cont == total) {
                this.paginator.loading = false
                this.loadData()
              }
            },
            error: (e) => {
              this.mapSummaryValidationResponse((e.error != null && e.error != undefined) ? e.error.detail : 'ERROR')
              cont++
              if (cont == total) {
                this.paginator.loading = false
                this.loadData()
              }
            },
            complete: () => {
            }
          })
        }
      }
    })
  }

  deleteItem(itemId: number) {
    this.confirmModal = this.modalService.open(ConfirmModalComponent, {
      data: { title: this.modalTitle, message: 'label.action-confirm', icon: Commons.ICON_WARNING },
    })
    this.confirmModal.onClose.subscribe((accept: any) => {
      if (accept) {
        this.deselectAll()
        this.paginator.loading = true
        this.service.deleteMyLicence(itemId).subscribe({
          next: async (v) => {
            this.paginator.loading = false
            this.loadData()
          },
          error: (e) => {
            this.mapServiceValidationResponse((e.error != null && e.error != undefined) ? e.error.detail : 'ERROR')
            this.paginator.loading = false
            this.loadData()
          },
          complete: () => {
          }
        })
      }
    })
  }

  viewDisableds() {
    this.deselectAll()
    this.paginator.page = 1
    this.paginator.status = this.paginator.statusInactive
    this.loadData()
  }

  viewEnableds() {
    this.deselectAll()
    this.paginator.page = 1
    this.paginator.status = this.paginator.statusActive
    this.loadData()
  }

  allSelect() {
    this.form = this.fb.group({
      checkArray: this.fb.array([])
    })
    const checkArray: FormArray = this.form.get('checkArray') as FormArray;
    for (let item of this.list) {
      var insert: boolean = true
      for (let check of this.form.value.checkArray) {
        if (check == JSON.stringify(item)) {
          insert = false
        }
      }
      if (insert) {
        checkArray.push(new FormControl(JSON.stringify(item)));
      }
    }
    this.allSelected = true
  }

  addFilters() {
    this.initFForm()
    this.paginator.addingFilters = true
  }

  clearFilters() {
    this.paginator.addingFilters = false
    this.initFForm()
    for (let item of this.filtersInSelect) {
      item.value = ''
      item.enabled = false
    }
    this.initFForm()
    this.buildFiltersTag()
    this.loadData()
  }

  applyFilter() {
    this.paginator.page = 1
    const field = this.fField.value
    for (let item of this.filtersInSelect) {
      if (item.field == field) {
        item.value = this.fValue.value
        item.enabled = true
      }
    }
    this.initFForm()
    this.buildFiltersTag()
    this.loadData()
  }

  removeFilter(field: string) {
    for (let item of this.filtersInSelect) {
      if (item.field == field) {
        item.value = ''
        item.enabled = false
      }
    }
    this.initFForm()
    this.buildFiltersTag()
    this.loadData()
  }

  buildFiltersTag() {
    this.paginator.filtersTag = ''
    for (let item of this.filtersInSelect) {
      if (item.enabled) {
        this.paginator.filtersTag = this.paginator.filtersTag + item.field + '-' + item.value + '__'
      }
    }
    this.paginator.filtersTag = this.paginator.filtersTag.slice(0, -2)
    if (this.paginator.filtersTag == '') {
      this.paginator.filtersTag = null
    }
  }

  /* BEGIN - Custom functions */
  buildLink(plan: any) {
    if (Commons.validField(plan) &&
      Commons.validField(plan.product) &&
      Commons.validField(plan.product.access_link)) {
      var arg = plan.product.access_link
      if (arg.startsWith('www')) {
        arg = 'https://' + arg
      }
      return arg
    }
    return '#'
  }

  buildProductName(plan: any) {
    if (Commons.validField(plan) &&
      Commons.validField(plan.product) &&
      Commons.validField(plan.product.name)) {
      return plan.product.name
    }
    return 'Unknown'
  }

  buildProductType(plan: any) {
    if (Commons.validField(plan) &&
      Commons.validField(plan.product) &&
      Commons.validField(plan.product.type)) {
      return plan.product.type
    }
    return 0
  }

  buildPlanName(plan: any) {
    if (Commons.validField(plan) &&
      Commons.validField(plan.name)) {
      return plan.name
    }
    return 'Unknown'
  }

  formatType(plan: any) {
    var arg = this.types[0].value
    if (Commons.validField(plan) &&
      Commons.validField(plan.type)) {
      arg = plan.type
    }
    const item = this.types.find(option => option.value === arg)
    if (item == undefined) {
      return this.types[0].name
    }
    return item.name
  }

  /**
   * Same algorithm in LicenceRepository
   * @param licence 
   * @returns 
   */
  expirationStatus(licence: any): number {
    return this.licencesConfig.expirationStatus(licence)
  }

}
