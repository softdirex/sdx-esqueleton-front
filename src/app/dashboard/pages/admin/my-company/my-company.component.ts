import { Component, HostListener, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { map, Observable, ReplaySubject, startWith } from 'rxjs';
import { CustomersService } from 'src/app/services/customers.service';
import { SessionService } from 'src/app/services/session.service';
import { StorageService } from 'src/app/services/storage.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-my-company',
  templateUrl: './my-company.component.html',
  styleUrls: ['./my-company.component.scss']
})
export class MyCompanyComponent implements OnInit {

  optionCreate: number = 1
  optionEdit: number = 2
  optionRequest: number = 3
  optionViewer: number = 4
  option: number = this.optionViewer
  form: FormGroup | null= null
  optionsCommercialBusiness: CommercialBusiness[] = CommercialBusinessType.TYPES
  provinceTypes: any[] = Commons.PROVINCE_TYPES
  optionsCountries: Country[] = [];
  filteredCountries: Observable<Country[]> | null = null
  public files: any[] = [];
  alertModal: MdbModalRef<AlertModalComponent> | null = null;
  confirmModal: MdbModalRef<ConfirmModalComponent> | null = null;
  logoFormValue: string = 'label.by-default'
  logoUrl: any
  companies: Company[] = []
  selectedCompany: Company = this.clearCompany()
  selCompany: MdbModalRef<SelectCompanyComponent> | null = null;
  modalTitle = 'label.my-organization'
  session = Commons.sessionObject().customer


  list: Customer[] = []
  paginator: PaginatorConfig = new PaginatorConfig()
  chkForm: FormGroup
  allSelected: boolean = false
  getScreenWidth: any;
  mobileWidth: number = Commons.MOBILE_WIDTH
  filtersInSelect: FILTER[] = [
    { label: 'label.email', field: 'email', value: '', enabled: false },
    { label: 'label.name', field: 'first_name', value: '', enabled: false },
    { label: 'label.last-name', field: 'last_name', value: '', enabled: false },
    { label: 'label.city', field: 'city', value: '', enabled: false },
    { label: 'label.country', field: 'country', value: '', enabled: false }
  ]
  fForm: FormGroup
  summary: string[] = []
  customerType = Commons.USER_TYPE_MEDIUM

  constructor(
    private router: Router,
    private countriesService: CountriesService,
    private ciaService: CompaniesService,
    private modalService: MdbModalService,
    private storageService: StorageService,
    private sanitizer: DomSanitizer,
    private sessionService: SessionService,
    private cusService: CustomersService,
    private fb: FormBuilder,
  ) {
    this.chkForm = this.fb.group({
      checkArray: this.fb.array([])
    })
  }

  ngOnInit(): void {
    this.getScreenWidth = window.innerWidth
    this.initFForm()
    this.selectedCompany = this.clearCompany()
    this.loadCountries()
    this.logoUrl = this.sanitizer.bypassSecurityTrustUrl(Commons.DF_COMPANY_LOGO)
    const customer = Commons.sessionObject().customer
    if (Commons.validField(customer.company)) {
      this.selectedCompany = customer.company
      this.storageService.getImage(this.selectedCompany.logo).subscribe(
        {
          next: async (v) => {
            this.logoUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(v))
          },
          error: (e) => {
            this.logoUrl = this.sanitizer.bypassSecurityTrustUrl(Commons.DF_COMPANY_LOGO)
          },
          complete: () => { }
        }
      )
    }
    if (customer.type == Commons.USER_TYPE_BASIC
      && customer.rol == Commons.USER_ROL_BASIC
      && customer.company == null) {
      this.option = this.optionCreate
    }
    this.form = new FormGroup({
      doc_number: new FormControl('', [Validators.required, Validators.pattern(environment.dniRegex)]),
      name: new FormControl('', [Validators.required, Validators.pattern(environment.namesRegex)]),
      logo: new FormControl(''),
      description: new FormControl('', [Validators.required, Validators.pattern(environment.obsRegex)]),
      commercial_business: new FormControl('', [Validators.required, Validators.pattern(environment.namesRegex)]),
      phone1: new FormControl('', [Validators.pattern(environment.phonesRegex)]),
      phone2: new FormControl('', [Validators.pattern(environment.phonesRegex)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      web: new FormControl('', [Validators.pattern(environment.obsRegex)]),
      address: new FormControl('', [Validators.required, Validators.pattern(environment.addressRegex)]),
      city: new FormControl('', [Validators.required, Validators.pattern(environment.namesRegex)]),
      province_type: new FormControl('', [Validators.required]),
      province_value: new FormControl('', [Validators.required, Validators.pattern(environment.namesRegex)]),
      country: new FormControl('', [Validators.required, Validators.pattern(environment.namesRegex)]),
    })
    if (customer.type == Commons.USER_TYPE_MEDIUM
      && customer.rol == Commons.USER_ROL_RWX
      && customer.company != null) {
      this.option = this.optionEdit
      this.form = new FormGroup({
        doc_number: new FormControl(this.selectedCompany.doc_number, [Validators.required, Validators.pattern(environment.dniRegex)]),
        name: new FormControl(this.selectedCompany.name, [Validators.required, Validators.pattern(environment.namesRegex)]),
        logo: new FormControl(''),
        description: new FormControl(this.selectedCompany.description, [Validators.required, Validators.pattern(environment.obsRegex)]),
        commercial_business: new FormControl(this.selectedCompany.commercial_business, [Validators.required, Validators.pattern(environment.namesRegex)]),
        phone1: new FormControl(this.selectedCompany.phone1, [Validators.pattern(environment.phonesRegex)]),
        phone2: new FormControl(this.selectedCompany.phone2, [Validators.pattern(environment.phonesRegex)]),
        email: new FormControl(this.selectedCompany.email, [Validators.required, Validators.email]),
        web: new FormControl(this.selectedCompany.web, [Validators.pattern(environment.obsRegex)]),
        address: new FormControl(this.selectedCompany.address, [Validators.required, Validators.pattern(environment.addressRegex)]),
        city: new FormControl(this.selectedCompany.city, [Validators.required, Validators.pattern(environment.namesRegex)]),
        province_type: new FormControl(this.selectedCompany.province_type, [Validators.required]),
        province_value: new FormControl(this.selectedCompany.province_value, [Validators.required, Validators.pattern(environment.namesRegex)]),
        country: new FormControl(this.selectedCompany.country, [Validators.required, Validators.pattern(environment.namesRegex)]),
      })
    }
    this.province_type.addValidators([this.validProvinceType(this.province_type), Validators.required])
    this.loadData()
  }

  get doc_number() { return this.form.get('doc_number')!; }
  get name() { return this.form.get('name')!; }
  get logo() { return this.form.get('logo')!; }
  get description() { return this.form.get('description')!; }
  get commercial_business() { return this.form.get('commercial_business')!; }
  get phone1() { return this.form.get('phone1')!; }
  get phone2() { return this.form.get('phone2')!; }
  get email() { return this.form.get('email')!; }
  get web() { return this.form.get('web')!; }
  get address() { return this.form.get('address')!; }
  get city() { return this.form.get('city')!; }
  get province_type() { return this.form.get('province_type')!; }
  get province_value() { return this.form.get('province_value')!; }
  get country() { return this.form.get('country')!; }

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
    if (this.selectedCompany.id != 0) {
      this.cusService.getIndexCustomersByCompany(
        this.selectedCompany.id,
        this.customerType,
        this.paginator.status,
        this.paginator.page,
        this.paginator.limit,
        this.paginator.filtersTag
      ).subscribe({
        next: async (v) => {
          this.paginator.total = v.meta.total
          this.paginator.firstPage = v.meta.first_page
          this.paginator.lastPage = v.meta.last_page
          this.paginator.currentPage = v.meta.current_page
          this.list = []
          for (let item of v.data) {
            if (item.email != Commons.sessionObject().customer.email) {
              this.list.push(item)
            }
          }
          this.buildPaginator()
        },
        error: (e) => { this.mapServiceValidationResponse((e.error != null && e.error != undefined) ? e.error.detail : 'ERROR') },
        complete: () => { }
      })
    }
  }

  changeCustomerType(arg) {
    this.customerType = arg
    this.paginator.page = 1
    this.paginator.status = this.paginator.statusActive
    this.loadData()
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

  removeSummary(detail: string) {
    const index = this.summary.indexOf(detail, 0);
    if (index > -1) {
      this.summary.splice(index, 1);
    }
  }

  addSummary(detail: string) {
    const index = this.summary.indexOf(detail, 0);
    if (index == -1) {
      this.summary.push(detail)
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

  toPage(arg: number) {
    this.deselectAll()
    this.paginator.page = arg
    this.loadData()
  }

  changeLimit(arg: number) {
    this.chkForm = this.fb.group({
      checkArray: this.fb.array([])
    })
    this.allSelected = false
    this.paginator.limit = arg
    this.loadData()
  }

  onCheckboxChange(e) {
    const checkArray: FormArray = this.chkForm.get('checkArray') as FormArray;
    if (e.target.checked) {
      checkArray.push(new FormControl(e.target.value));
      if (checkArray.length == this.list.length) {
        this.allSelected = true
      }
    } else {
      let i: number = 0;
      checkArray.controls.forEach((item: FormControl) => {
        if (item.value == e.target.value) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  toString(arg: any) {
    return JSON.stringify(arg)
  }

  disableSelected() {
    this.confirmModal = this.modalService.open(ConfirmModalComponent, {
      data: { title: this.modalTitle, message: 'label.action-confirm', icon: Commons.ICON_WARNING },
    })
    this.confirmModal.onClose.subscribe((accept: any) => {
      if (accept) {
        this.paginator.loading = true
        var selected: Customer[] = new Array()
        for (let item of this.chkForm.value.checkArray) {
          selected.push(JSON.parse(item))
        }
        const total = selected.length
        var cont = 0
        for (let item of selected) {
          item.status = this.paginator.statusInactive
          this.cusService.updateCustomersByCompany(this.selectedCompany.id, item.id, item).subscribe({
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
    }
    )
  }

  enableSelected() {
    this.confirmModal = this.modalService.open(ConfirmModalComponent, {
      data: { title: this.modalTitle, message: 'label.action-confirm', icon: Commons.ICON_WARNING },
    })
    this.confirmModal.onClose.subscribe((accept: any) => {
      if (accept) {
        this.paginator.loading = true
        var selected: Customer[] = new Array()
        for (let item of this.chkForm.value.checkArray) {
          selected.push(JSON.parse(item))
        }
        const total = selected.length
        var cont = 0
        for (let item of selected) {
          item.status = this.paginator.statusActive
          this.cusService.updateCustomersByCompany(this.selectedCompany.id, item.id, item).subscribe({
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
    }
    )
  }

  deleteSelected() {
    this.confirmModal = this.modalService.open(ConfirmModalComponent, {
      data: { title: this.modalTitle, message: 'label.action-confirm', icon: Commons.ICON_WARNING },
    })
    this.confirmModal.onClose.subscribe((accept: any) => {
      if (accept) {
        this.paginator.loading = true
        var selected: Customer[] = new Array()
        for (let item of this.chkForm.value.checkArray) {
          selected.push(JSON.parse(item))
        }
        const total = selected.length
        var cont = 0
        for (let item of selected) {
          this.cusService.deleteCustomersByCompany(this.selectedCompany.id, item.id).subscribe({
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
    }
    )
  }

  disableItem(item: Customer) {
    this.confirmModal = this.modalService.open(ConfirmModalComponent, {
      data: { title: this.modalTitle, message: 'label.action-confirm', icon: Commons.ICON_WARNING },
    })
    this.confirmModal.onClose.subscribe((accept: any) => {
      if (accept) {
        this.deselectAll()
        this.paginator.loading = true
        item.status = this.paginator.statusInactive
        this.cusService.updateCustomersByCompany(this.selectedCompany.id, item.id, item).subscribe({
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
    }
    )
  }

  activateItem(item: Customer) {
    this.confirmModal = this.modalService.open(ConfirmModalComponent, {
      data: { title: this.modalTitle, message: 'label.action-confirm', icon: Commons.ICON_WARNING },
    })
    this.confirmModal.onClose.subscribe((accept: any) => {
      if (accept) {
        this.deselectAll()
        this.paginator.loading = true
        item.status = this.paginator.statusActive
        this.cusService.updateCustomersByCompany(this.selectedCompany.id, item.id, item).subscribe({
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
    }
    )
  }

  deleteItem(itemId: number) {
    this.confirmModal = this.modalService.open(ConfirmModalComponent, {
      data: { title: this.modalTitle, message: 'label.action-confirm', icon: Commons.ICON_WARNING },
    })
    this.confirmModal.onClose.subscribe((accept: any) => {
      if (accept) {
        this.deselectAll()
        this.paginator.loading = true
        this.cusService.deleteCustomersByCompany(this.selectedCompany.id, itemId).subscribe({
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
    }
    )
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

  viewDeleteds() {
    this.deselectAll()
    this.paginator.page = 1
    this.paginator.status = this.paginator.statusDeleted
    this.loadData()
  }

  allSelect() {
    this.chkForm = this.fb.group({
      checkArray: this.fb.array([])
    })
    const checkArray: FormArray = this.chkForm.get('checkArray') as FormArray;
    for (let item of this.list) {
      var insert: boolean = true
      for (let check of this.chkForm.value.checkArray) {
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

  deselectAll() {
    this.chkForm = this.fb.group({
      checkArray: this.fb.array([])
    })
    this.allSelected = false
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

  edit(memberId: number) {
    this.router.navigate([Commons.PATH_MY_COMPANY_MEMBERS_EDIT + '/' + Commons.encryptString(memberId + '')])
  }

  add() {
    this.router.navigate([Commons.PATH_MY_COMPANY_MEMBERS_CREATE])
  }

  goBack() {
    this.router.navigate([Commons.PATH_MAIN])
  }

  getProvinceTypeLabel(value: string): string {
    const type = this.provinceTypes.find(item => item.value == value)
    if (type == undefined) {
      return this.provinceTypes[0].name
    }
    return type.name
  }

  getErrorMessage(field: any) {
    if (field.hasError('required')) {
      return 'validations.required-field'
    }
    if (field.hasError('validProvinceType')) {
      return 'validations.required-field'
    }
    if (field.hasError('validProvinceType')) {
      return 'validations.required-field'
    }
    if (field.hasError('email')) {
      return 'validations.invalid-field'
    }
    if (field.hasError('validCountry')) {
      return 'validations.invalid-country'
    }
    return field.hasError('pattern') ? 'validations.invalid-field' : '';
  }

  validProvinceType(value1: AbstractControl): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null =>
      this.provinceTypes.filter(option => option.value === value1.value).length == 1
        ? null : { validProvinceType: control.value };
  }

  onKeyValidator() {
    this.country.setValidators([this.validCountry(this.country), Validators.required])
  }

  validCountry(value1: AbstractControl): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null =>
      this.optionsCountries.filter(option => option.name === value1.value).length == 1
        ? null : { validCountry: control.value };
  }

  loadCountries() {
    this.countriesService.getAllCountries()
      .subscribe(
        {
          next: (v) => {
            if (Commons.validField(v) && Commons.validField(v.data)) {
              for (let cRs of v.data) {
                this.optionsCountries.push(cRs)
              }
              this.filteredCountries = this.country.valueChanges.pipe(
                startWith(''),
                map(value => {
                  const name = typeof value === 'string' ? value : value?.name;
                  return name ? this._filter(name as string) : this.optionsCountries.slice();
                }),
              );
            }
          },
          error: (e) => { },
          complete: () => { }
        }
      )
  }

  private _filter(name: string): Country[] {
    const filterValue = name.toLowerCase();

    return this.optionsCountries.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  submit() {
    this.confirmModal = this.modalService.open(ConfirmModalComponent, {
      data: { title: this.modalTitle, message: 'label.action-confirm', icon: Commons.ICON_WARNING },
    })
    this.confirmModal.onClose.subscribe((accept: any) => {
      if (accept) {
        if (this.files[0] != undefined) {
          this.imageDimentionsValidToSend(this.files[0])
        } else {
          this.sendFormValues()
        }
      }
    }
    )
  }

  sendFormValues() {
    if (this.option == this.optionCreate) {
      const company = {
        doc_number: this.doc_number.value,
        name: this.name.value,
        description: this.description.value,
        logo: this.logo.value,
        commercial_business: this.commercial_business.value,
        phone1: this.phone1.value,
        phone2: this.phone2.value,
        email: this.email.value,
        web: this.web.value,
        address: this.address.value,
        city: this.city.value,
        province_type: this.province_type.value,
        province_value: this.province_value.value,
        country: this.country.value,
        status: Commons.STATUS_ACTIVE
      }
      this.ciaService.myCompanyStore(company).subscribe({
        next: async (v) => {
          this.openModal('label.add-company', 'label.add-company-success', Commons.ICON_SUCCESS)
          this.cusService.getMyCustomer().subscribe({
            next: async (v) => {
              this.reloadSessionData(v)
            },
            error: (e) => {
              this.openModal('label.customer-detail', 'label.customer-not-found', Commons.ICON_WARNING)
              this.goBack()
            },
            complete: () => { }
          })
          this.goBack()
        },
        error: (e) => {
          this.mapServiceValidationResponse((e.error != null && e.error != undefined) ? e.error.detail : 'ERROR')
        },
        complete: () => { }
      })
    } else {
      this.selectedCompany.name = this.name.value
      this.selectedCompany.description = this.description.value
      if (Commons.validField(this.logo.value) && this.logo.value != '') {
        this.selectedCompany.logo = this.logo.value
      }
      this.selectedCompany.commercial_business = this.commercial_business.value
      this.selectedCompany.phone1 = this.phone1.value
      this.selectedCompany.phone2 = this.phone2.value
      this.selectedCompany.email = this.email.value
      this.selectedCompany.web = this.web.value
      this.selectedCompany.address = this.address.value
      this.selectedCompany.city = this.city.value
      this.selectedCompany.province_type = this.province_type.value
      this.selectedCompany.province_value = this.province_value.value
      this.selectedCompany.country = this.country.value
      this.ciaService.myCompanyUpdate(this.selectedCompany.id, this.selectedCompany).subscribe({
        next: async (v) => {
          this.alertModal = this.modalService.open(AlertModalComponent, {
            data: {
              title: this.modalTitle,
              message: 'label.update-company-success',
              icon: Commons.ICON_SUCCESS
            },
          })
          this.alertModal.onClose.subscribe(() => {
            var cus = Commons.sessionObject().customer
            cus.company = v
            this.reloadSessionData(cus)
          })
        },
        error: (e) => {
          this.mapServiceValidationResponse((e.error != null && e.error != undefined) ? e.error.detail : 'ERROR')
        },
        complete: () => { }
      })
    }

  }

  reloadSessionData(customer: any) {
    Commons.sessionReloadCustomer(customer)
    window.location.reload()
  }

  openModal(title: string, message: string, icon: string) {
    this.alertModal = this.modalService.open(AlertModalComponent, {
      data: { title: title, message: message, icon: icon },
    })
  }

  imageDimentionsValidToSend(file: any) {
    var img = new Image()
    this.convertFile(file).subscribe(base64 => {
      img.src = 'data:image/jpg;base64,'
        + base64.toString();
    });
    img.onload = () => {
      if (!this.isValidImgDimentions(img)) {
        this.openModal('validations.files', 'validations.image-dimentions-exceed', Commons.ICON_WARNING)
      } else {
        this.storageService.attachFile(this.files[0]).subscribe({
          next: async (v) => {
            if (v.filename) {
              this.logo.setValue(v.filename)
              this.sendFormValues()
            }
          },
          error: (e) => { this.mapServiceValidationResponse((e.error != null && e.error != undefined) ? e.error.detail : 'ERROR') },
          complete: () => { }
        })
      }
    };
  }

  convertFile(file: File): Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event) => result.next(btoa(event.target.result.toString()));
    return result;
  }

  isValidImgDimentions(img: any): boolean {
    const MIN = 150
    const MAX = 900
    var diff = Math.trunc(img.height / 100) - Math.trunc(img.width / 100)
    const sign = Math.sign(Math.trunc(img.height / 100) - Math.trunc(img.width / 100))
    if (sign == -1) {
      diff = diff * sign
    }
    const isQuad = diff >= 0 && diff < 4
    const validDimentions = (img.height >= MIN && img.height <= MAX)
      && (img.width >= MIN && img.width <= MAX)
    return isQuad && validDimentions
  }

  private mapServiceValidationResponse(detail: any) {
    detail = (detail != undefined && detail != null) ? detail : 'ERROR'
    switch (detail) {
      case 'Exceeds the size':
        this.openModal('validations.files', 'validations.files-exceed', Commons.ICON_WARNING)
        break;
      case 'Company already exist':
        this.openModal('label.add-company', 'label.add-company-exist', Commons.ICON_WARNING)
        break;
      case 'Exceed the maximum number of filters':
        this.openModal('validations.filters', 'validations.filters-exceed', Commons.ICON_WARNING)
        break;
      case 'Invalid country name':
        this.openModal('validations.operation-not-success', 'validations.invalid-country', Commons.ICON_WARNING)
        break;
      case 'wrong privilege to delete inactive':
        this.openModal('validations.not-allowed', 'validations.wrong-privilege', Commons.ICON_WARNING)
        break
      case 'wrong privilege to delete active':
        this.openModal('validations.not-allowed', 'validations.wrong-privilege', Commons.ICON_WARNING)
        break
      case 'wrong privilege to approve active':
        this.openModal('validations.not-allowed', 'validations.wrong-privilege', Commons.ICON_WARNING)
        break
      case 'wrong privilege to restore deleted':
        this.openModal('validations.not-allowed', 'validations.wrong-privilege', Commons.ICON_WARNING)
        break
      default:
        this.openModal('label.unknown-error', 'label.unknown-error-contact-retry', Commons.ICON_ERROR)
        break;
    }
  }

  /**
  * on file drop handler
  */
  onFileDropped($event) {
    this.prepareFilesList($event);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(files) {
    this.prepareFilesList(files);
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number) {
    this.files = []
    this.logoFormValue = 'label.by-default'
    this.logoUrl = this.sanitizer.bypassSecurityTrustUrl(Commons.DF_COMPANY_LOGO)
  }

  /**
   * Simulate the upload process
   */
  uploadFile(index: number) {
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFile(index + 1);
          } else {
            this.files[index].progress += 5;
          }
        }, 200);
      }
    }, 1000);
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      // validacion del formato en item.type
      if (item.type != 'image/png' && item.type != 'image/jpeg') {
        this.openModal('Formato invalido', 'Solo se pueden cargar imagenes', Commons.ICON_WARNING)
      } else {
        // delete first file when isn't multiple uploads
        this.imageDimentionsValidToLoad(item)
      }
    }
    this.uploadFile(0);
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes, decimals) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  imageDimentionsValidToLoad(file: any) {
    var img = new Image()
    this.convertFile(file).subscribe(base64 => {
      img.src = 'data:image/jpg;base64,'
        + base64.toString();
    });
    img.onload = () => {
      if (!this.isValidImgDimentions(img)) {
        this.openModal('validations.files', 'validations.image-dimentions-exceed', Commons.ICON_WARNING)
      } else {
        this.logoFormValue = 'label.loaded-by-file'
        this.files.splice(0, 1);
        this.files.push(file);
        this.logoUrl = this.sanitizer.bypassSecurityTrustUrl(img.src)
      }
    };
  }

  loadCompany(event: any) {
    this.doc_number.setValue(event.target.value)
    if (Commons.validField(this.doc_number.value) && this.doc_number.value.length > 5) {
      this.ciaService.getIndexBasic(Commons.STATUS_ACTIVE, 1, 4, 'doc_number-' + this.doc_number.value).subscribe({
        next: async (v) => {
          this.companies = v.data
          if (this.companies.length > 0) {
            if (this.companies.length == 1) {
              this.selectedCompany = this.companies[0]
              this.loadLogo(this.selectedCompany.logo)
              this.option = this.optionRequest
            } else {
              this.selectedCompany = this.clearCompany()
              this.openCompanySelect()
            }
          } else {
            this.selectedCompany = this.clearCompany()
          }
        },
        error: (e) => {
          this.option = this.optionCreate
        },
        complete: () => { }
      })
    } else {
      this.option = this.optionCreate
    }
  }

  clearCompany() {
    return {
      id: 0,
      doc_number: '',
      name: '',
      description: '',
      logo: '',
      commercial_business: '',
      phone1: '',
      phone2: '',
      email: '',
      web: '',
      address: '',
      city: '',
      province_type: '',
      province_value: '',
      country: '',
      status: 0,
      created_at: null,
      updated_at: null,
    }
  }

  openCompanySelect() {
    this.selCompany = this.modalService.open(SelectCompanyComponent, {
      data: { companies: this.companies }
    })
    this.selCompany.onClose.subscribe((companyId: any) => {
      for (let item of this.companies) {
        if (item.id == companyId) {
          this.option = this.optionRequest
          this.selectedCompany = item
          this.loadLogo(this.selectedCompany.logo)
        }
      }
    });
  }

  loadLogo(logo: any) {
    this.storageService.getImage(logo).subscribe(
      {
        next: async (v) => {
          this.logoUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(v))
        },
        error: (e) => {
          this.logoUrl = this.sanitizer.bypassSecurityTrustUrl(Commons.DF_COMPANY_LOGO)
        },
        complete: () => { }
      }
    )
  }

  createRequest() {
    this.confirmModal = this.modalService.open(ConfirmModalComponent, {
      data: { title: this.modalTitle, message: 'label.action-confirm', icon: Commons.ICON_WARNING },
    })
    this.confirmModal.onClose.subscribe((accept: any) => {
      if (accept) {
        this.ciaService.myCompanyRequestMember(this.selectedCompany.id).subscribe(
          {
            next: async (v) => {
              this.alertModal = this.modalService.open(AlertModalComponent, {
                data: {
                  title: this.modalTitle,
                  message: 'label.company-request-successful',
                  icon: Commons.ICON_WARNING
                },
              })
              this.alertModal.onClose.subscribe(() => {
                this.sessionService.setUserLoggedIn(false);
                Commons.sessionClose()
                this.router.navigate([Commons.PATH_LOGIN]).then(() => {
                  window.location.reload();
                });
              })
            },
            error: (e) => {
              this.openModal('label.unknown-error', 'label.unknown-error-contact-retry', Commons.ICON_ERROR)
            },
            complete: () => { }
          }
        )
      }
    });
  }

  formatRol(rol: string) {
    return Commons.getCusRol(rol)
  }

  get validSession(): boolean {
    return this.session.rol != Commons.USER_ROL_BASIC
  }

  customerStatus(item: any): any {
    var alert = 'bg-danger'
    var text = 'label.deleted'
    switch (item.status) {
      case this.paginator.statusDeleted:
      case this.paginator.statusDeletedInactive:
        alert = 'bg-danger'
        text = 'label.deleted'
        break;
      case this.paginator.statusActive:
        alert = 'bg-success'
        text = 'label.active'
        break;
      case this.paginator.statusInactive:
        alert = 'bg-warning'
        text = 'label.inactive'
        break;
      case this.paginator.statusInProcess:
        alert = 'bg-info'
        text = 'label.in-progress'
        break;
      default:
        alert = 'bg-default'
        text = 'label.locked'
        break;
    }
    if (!Commons.validField(item.email_verified_at)) {
      alert = 'bg-warning'
      text = 'label.email-verification'
    }
    return {
      alert: alert,
      text: text
    }
  }
}
