import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { map, Observable, startWith } from 'rxjs';
import { CountriesService } from 'src/app/services/countries.service';
import { CustomersService } from 'src/app/services/customers.service';
import { LanguageUtilService } from 'src/app/services/language-util.service';
import { Commons } from 'src/app/shared/Commons';
import { Country } from 'src/app/shared/interfaces/core/country';
import { CustomerRequest } from 'src/app/shared/interfaces/core/customer-request';
import { PersonalData } from 'src/app/shared/interfaces/core/personal-data';
import { PersonalDataRequest } from 'src/app/shared/interfaces/core/personal-data-request';
import { AlertModalComponent } from 'src/app/shared/modals/alert-modal/alert-modal.component';
import { ConfirmModalComponent } from 'src/app/shared/modals/confirm-modal/confirm-modal.component';
import { NameFormatPipe } from 'src/app/shared/pipes/name-format.pipe';
import { RutPipe } from 'src/app/shared/pipes/rut.pipe';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  privacyPolicyPath: string = Commons.PATH_TERMS + '/' + Commons.TERM_CODES[0].code
  termConditionsPath: string = Commons.PATH_TERMS + '/' + Commons.TERM_CODES[1].code
  // Step validator
  currentStep?: number
  // Coutries for autocomplete
  optionsCountries: Country[] = [];
  /* -BEGIN- Step Values */
  STEP_DOCUMENT_DATA = 1
  STEP_OPTION_SELECT = 2
  STEP_REGISTER = 3
  STEP_CUSTOMER = 4
  /* --END-- Step Values */

  /* -BEGIN- STEP_DOCUMENT_DATA Fields */
  documentDataTypes: any[] = Commons.DOCUMENT_DATA_TYPES
  fDocumentData!: FormGroup
  personalDataSession?: PersonalData
  filteredCountriesDocumentData: Observable<Country[]> | null = null
  /* --END-- STEP_DOCUMENT_DATA Fields */
  /* -BEGIN- STEP_REGISTER Fields */
  fPersonalData!: FormGroup
  pdReq?: PersonalDataRequest
  totalCustomers: number = 0
  genderTypes: any[] = Commons.GENDER_TYPES
  filteredCountriesPersonalData: Observable<Country[]> | null = null
  maxYear: any = { year: (new Date().getFullYear()) - 14, month: 1, day: 1 }
  minYear: any = { year: (new Date().getFullYear()) - 80, month: 1, day: 1 }
  startYear: any = { year: (new Date().getFullYear()) - 33, month: 1, day: 1 };
  confirmModal: MdbModalRef<ConfirmModalComponent> | null = null;
  alertModal: MdbModalRef<AlertModalComponent> | null = null;
  emailConfirmationMessage?: string
  validNames: string = ''
  /* --END-- STEP_REGISTER Fields */
  /* -BEGIN- STEP_CUSTOMER Fields */
  fCustomer!: FormGroup
  /* --END-- STEP_CUSTOMER Fields */
  loginPath: string = Commons.PATH_LOGIN
  termsConditionsPath: string = Commons.PATH_TERMS
  model: any

  constructor(
    private countriesService: CountriesService,
    private customersService: CustomersService,
    private router: Router,
    private langService: LanguageUtilService,
    private modalService: MdbModalService,
    private nameFormat: NameFormatPipe
  ) { }

  ngOnInit() {
    if (Commons.sessionIsOpen()) {
      this.router.navigate([Commons.PATH_MAIN])
    }
    /* -BEGIN- STEP_DOCUMENT_DATA Instances */
    var transientPDSession = sessionStorage.getItem('register')
    if (transientPDSession != null) {
      this.personalDataSession = JSON.parse(transientPDSession)
    } else {
      this.personalDataSession = this.initEmptyPersoanlData()
    }

    this.currentStep = this.STEP_DOCUMENT_DATA
    this.fDocumentData = new FormGroup({
      docType: new FormControl((this.personalDataSession != undefined &&
        this.personalDataSession.document_data != null) ?
        this.personalDataSession.document_data[0].type : '', [Validators.required]),
      docValue: new FormControl((this.personalDataSession != undefined &&
        this.personalDataSession.document_data != null) ?
        this.personalDataSession.document_data[0].value : '', [Validators.required, Validators.pattern(environment.documentDataRegex)]),
      docCountry: new FormControl((this.personalDataSession != undefined &&
        this.personalDataSession.document_data != null) ?
        this.personalDataSession.document_data[0].country : '', [Validators.required, Validators.minLength(4)])
    })

    this.filteredCountriesDocumentData = this.docCountry.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filter(name as string) : this.optionsCountries.slice();
      }),
    );
    /* --END-- STEP_DOCUMENT_DATA Instances */
    /* -BEGIN- STEP_REGISTER Instances */
    this.fPersonalData = new FormGroup({
      name: new FormControl(
        (this.personalDataSession != undefined && this.personalDataSession.first_name != null)
          ? this.personalDataSession.first_name : '',
        [Validators.required, Validators.pattern(environment.namesRegex), Validators.maxLength(90), Validators.minLength(2)]),
      lastName: new FormControl(
        (this.personalDataSession != undefined && this.personalDataSession.last_name != null)
          ? this.personalDataSession.last_name : '',
        [Validators.required, Validators.pattern(environment.namesRegex), Validators.maxLength(90), Validators.minLength(2)]),
      email: new FormControl(this.getContactDataFromSession('MAIL'), [Validators.required, Validators.email]),
      phone: new FormControl(this.getContactDataFromSession('PHONE'), [Validators.required, Validators.pattern(environment.phonesRegex), Validators.maxLength(35), Validators.minLength(8)]),
      gender: new FormControl((this.personalDataSession != undefined && this.personalDataSession.sex != null)
        ? this.personalDataSession.sex + '' : '', [Validators.required]),
      birthday: new FormControl(
        (this.personalDataSession != undefined && this.personalDataSession.birthday != null)
          ? new Date(this.personalDataSession.birthday) : '', [Validators.required]),
      address: new FormControl((this.personalDataSession != undefined && this.personalDataSession.address != null)
        ? this.personalDataSession.address : '', [Validators.required, Validators.pattern(environment.addressRegex), Validators.maxLength(90), Validators.minLength(2)]),
      city: new FormControl(
        (this.personalDataSession != undefined && this.personalDataSession.city != null)
          ? this.personalDataSession.city : '', [Validators.required, Validators.pattern(environment.namesRegex), Validators.maxLength(90), Validators.minLength(2)]),
      country: new FormControl(
        (this.personalDataSession != undefined && this.personalDataSession.country != null)
          ? this.personalDataSession.country : '', [Validators.required, Validators.minLength(4), Validators.pattern(environment.namesRegex), Validators.maxLength(90), Validators.minLength(2)]),
      pwd: new FormControl('', [Validators.required, Validators.pattern(environment.pwdRegex)]),
      pwd2: new FormControl('', [Validators.required, Validators.pattern(environment.pwdRegex)]),
      tcCheck: new FormControl(false, [Validators.required, Validators.requiredTrue]),
      ppCheck: new FormControl(false, [Validators.required, Validators.requiredTrue]),
    })

    this.filteredCountriesPersonalData = this.country.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filter(name as string) : this.optionsCountries.slice();
      }),
    );

    this.gender.setValidators([this.validGender(this.gender), Validators.required])
    this.pwd2.addValidators(this.sameValue(this.pwd))
    /* --END-- STEP_REGISTER Instances */
    /* -BEGIN- STEP_CUSTOMER Instances */
    this.fCustomer = new FormGroup({
      cusEmail: new FormControl('', [Validators.required, Validators.email]),
      cusPwd: new FormControl('', [Validators.required, Validators.pattern(environment.pwdRegex)]),
      cusPwd2: new FormControl('', [Validators.required, Validators.pattern(environment.pwdRegex)]),
      cusTcCheck: new FormControl('', [Validators.required, Validators.requiredTrue]),
      cusPpCheck: new FormControl('', [Validators.required, Validators.requiredTrue]),
    })
    this.cusPwd2.addValidators(this.sameValue(this.cusPwd))
    /* --END-- STEP_CUSTOMER Instances */
    this.loadCountries()
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
              this.filteredCountriesPersonalData = this.country.valueChanges.pipe(
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

  ngAfterContentChecked(): void {
    this.emailConfirmationMessage = this.langService.translate('register.confirm-email-question')
  }

  getContactDataFromSession(arg: string): string {
    if (this.personalDataSession != undefined &&
      this.personalDataSession.contact_data != null) {
      for (let element of this.personalDataSession.contact_data) {
        if (element.type == arg) {
          return element.value
        }
      }
    }
    return ''
  }

  initEmptyPersoanlData(): PersonalData {
    return {
      id: null,
      first_name: '',
      last_name: '',
      address: '',
      city: '',
      province_type: '',
      province_value: '',
      country: '',
      sex: 0,
      birthday: null,
      status: null,
      created_at: null,
      updated_at: null,
      document_data: [{
        id: null,
        type: '',
        value: '',
        status: null,
        created_at: null,
        updates_at: null
      }],
      contact_data: null,
      customers: null
    }
  }

  /* -BEGIN- STEP_DOCUMENT_DATA Get Controls */
  get docType() { return this.fDocumentData.get('docType')!; }
  get docValue() { return this.fDocumentData.get('docValue')!; }
  get docCountry() { return this.fDocumentData.get('docCountry')!; }
  /* --END-- STEP_DOCUMENT_DATA Get Controls */
  /* -BEGIN- STEP_REGISTER Get Controls */
  get name() { return this.fPersonalData.get('name')!; }
  get lastName() { return this.fPersonalData.get('lastName')!; }
  get email() { return this.fPersonalData.get('email')!; }
  get phone() { return this.fPersonalData.get('phone')!; }
  get gender() { return this.fPersonalData.get('gender')!; }
  get birthday() { return this.fPersonalData.get('birthday') as FormControl; }
  get address() { return this.fPersonalData.get('address')!; }
  get city() { return this.fPersonalData.get('city')!; }
  get country() { return this.fPersonalData.get('country')!; }
  get pwd() { return this.fPersonalData.get('pwd')!; }
  get pwd2() { return this.fPersonalData.get('pwd2')!; }
  get tcCheck() { return this.fPersonalData.get('tcCheck')!; }
  get ppCheck() { return this.fPersonalData.get('ppCheck')!; }
  /* --END-- STEP_REGISTER Get Controls */
  /* -BEGIN- STEP_CUSTOMER Get Controls */
  get cusEmail() { return this.fCustomer.get('cusEmail')!; }
  get cusPwd() { return this.fCustomer.get('cusPwd')!; }
  get cusPwd2() { return this.fCustomer.get('cusPwd2')!; }
  get cusTcCheck() { return this.fCustomer.get('cusTcCheck')!; }
  get cusPpCheck() { return this.fCustomer.get('cusPpCheck')!; }
  /* -BEGIN- STEP_CUSTOMER Get Controls */

  getErrorMessage(field: any) {
    if (field.hasError('required')) {
      return 'validations.required-field'
    }
    if (field.hasError('validProvinceType')) {
      return 'validations.required-field'
    }
    if (field.hasError('validGender')) {
      return 'validations.required-field'
    }
    if (field.hasError('email')) {
      return 'validations.invalid-field'
    }
    if (field.hasError('notSame')) {
      return 'validations.notsame-pwd'
    }
    if (field.hasError('validCountry')) {
      return 'validations.invalid-country'
    }
    if (field.errors != null && field.errors.pattern != null &&
      field.errors.pattern.requiredPattern === environment.pwdRegex
    ) {
      return 'validations.invalid-pwd'
    }

    return field.hasError('pattern') ? 'validations.invalid-field' : '';
  }

  private _filter(name: string): Country[] {
    const filterValue = name.toLowerCase();

    return this.optionsCountries.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  validCountry(value1: AbstractControl): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null =>
      this.optionsCountries.filter(option => option.name === value1.value).length == 1
        ? null : { validCountry: control.value };
  }

  onKeyValidatorCountry1() {
    this.docCountry.setValidators([this.validCountry(this.docCountry), Validators.required])
  }

  onKeyValidatorCountry2() {
    this.country.setValidators([this.validCountry(this.country), Validators.required])
  }

  validGender(value1: AbstractControl): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null =>
      this.genderTypes.filter(option => option.value === value1.value).length == 1
        ? null : { validGender: control.value };
  }

  sameValue(value1: AbstractControl): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null =>
      control.value === value1.value
        ? null : { notSame: control.value };
  }

  transformRut(): any {
    const rutPipe: RutPipe = new RutPipe()
    return this.docValue.setValue(rutPipe.transform(this.docValue.value))
  }

  toStep2() {
    if (this.personalDataSession != undefined) {
      this.personalDataSession.country = this.docCountry.value
      this.country.setValue(this.docCountry.value)
      this.personalDataSession.document_data = [{
        id: null,
        type: this.docType.value.toUpperCase(),
        value: this.docValue.value,
        country: this.docCountry.value,
        status: null,
        created_at: null,
        updates_at: null
      }]
      sessionStorage.setItem('register', JSON.stringify(this.personalDataSession))
    }


    this.customersService.getBasicPersonalData(this.docType.value, this.docValue.value, this.docCountry.value)
      .subscribe({
        next: (v) => {
          if (v != null) {
            this.currentStep = this.STEP_OPTION_SELECT
            this.pdReq = v
            this.totalCustomers = v.total_customers
          } else {
            this.currentStep = this.STEP_REGISTER
          }
        },
        error: (e) => {
          this.currentStep = this.STEP_REGISTER
        },
        complete: () => console.info('request complete')
      }
      )
  }

  getCustomerName(): string {
    if (this.pdReq != undefined) {
      return this.pdReq.first_name
    }
    return 'NO-NAME'
  }

  goLogin() {
    this.router.navigate([Commons.PATH_LOGIN])
  }

  goStep(step: number) {
    this.currentStep = step
  }

  openConfirmModal() {
    const message = this.emailConfirmationMessage?.replace('MAIL_VALUE', this.email.value.toLowerCase())
    this.confirmModal = this.modalService.open(ConfirmModalComponent, {
      data: { title: 'register.confirm-email-title', message: message, icon: Commons.ICON_WARNING },
    })
    this.confirmModal.onClose.subscribe((accept: any) => {
      if (accept) {
        this.createCustomerWithPersonalData()
      }
    });
  }

  openModal(title: string, message: string, icon: string) {
    this.alertModal = this.modalService.open(AlertModalComponent, {
      data: { title: title, message: message, icon: icon },
    })
  }

  createCustomerWithPersonalData() {

    this.pdReq = {
      first_name: this.nameFormat.transform(this.name.value),
      last_name: this.nameFormat.transform(this.lastName.value),
      address: this.nameFormat.transform(this.address.value),
      city: this.nameFormat.transform(this.city.value),
      province_type: Commons.PROVINCE_TYPES[0].value,
      province_value: '',
      country: this.country.value,
      sex: Number.parseInt(this.gender.value),
      birthday: this.formatBirthdayDate(this.birthday.value),
      status: null,
      document_data: [
        {
          type: this.docType.value.toUpperCase(),
          value: this.docValue.value.toUpperCase(),
          country: this.docCountry.value.toUpperCase()
        }
      ],
      contact_data: [
        {
          type: 'PHONE',
          value: this.phone.value.toUpperCase()
        },
        {
          type: 'MAIL',
          value: this.email.value.toLowerCase()
        }
      ]
    }
    const customer: CustomerRequest = {
      lang: this.langService.getLangActive(),
      email: this.email.value.toLowerCase(),
      status: Commons.STATUS_ACTIVE,
      personal_data: this.pdReq,
      type: Commons.USER_TYPE_BASIC,
      rol: Commons.USER_ROL_BASIC,
      password: this.pwd.value,
      avatar: Commons.DF_AVATAR
    }
    sessionStorage.setItem('register', JSON.stringify(this.pdReq))
    customer.personal_data.birthday = this.formatBirthdayDate(this.birthday.value)
    this.customersService.registerCustomer(customer)
      .subscribe(
        {
          next: (v) => {
            if (v != null) {
              this.succesfullStep()
            }
          },
          error: (e) => {
            this.mapServiceValidationResponse((e.error != null && e.error != undefined) ? e.error.detail : 'ERROR')
          },
          complete: () => { }
        }
      )
  }

  formatBirthdayDate(arg: any): string | null {

    if (Commons.validField(arg)) {
      var month = arg.month + ''
      var day = arg.day + ''
      return arg.year + '-' + month.padStart(2, '0') + '-' + day.padStart(2, '0')
    }
    return null
  }

  private mapServiceValidationResponse(detail: any) {
    detail = (detail != undefined && detail != null) ? detail : 'ERROR'
    detail = detail.replace('API_RESPONSE: ', '')
    switch (detail) {
      case 'Invalid country name':
        this.openModal('validations.invalid-country', 'validations.invalid-country-msg', Commons.ICON_WARNING)
        break;
      case 'The email entered is already in use':
        this.openModal('validations.email-used', 'register.other-email', Commons.ICON_WARNING)
        break;
      case 'Document Data already exist':
        this.openModal('label.document-validation', 'label.document-exist', Commons.ICON_WARNING)
        break;
      default:
        this.openModal('label.unknown-error', 'label.unknown-error-contact-retry', Commons.ICON_ERROR)
        break;
    }
    if (detail.startsWith('valid_names[')) {
      this.validNames = detail.replace('valid_names[', '').replace(']', '')
      this.openModal('validations.invalid-country-msg', this.validNames, Commons.ICON_WARNING)
    }
  }

  createCustomer() {

    const customer: CustomerRequest = {
      lang: this.langService.getLangActive(),
      email: this.cusEmail.value.toLowerCase(),
      status: Commons.STATUS_ACTIVE,
      personal_data: this.pdReq,
      type: Commons.USER_TYPE_BASIC,
      rol: Commons.USER_ROL_BASIC,
      password: this.cusPwd.value,
      avatar: Commons.DF_AVATAR,
    }
    this.customersService.registerCustomer(customer)
      .subscribe(
        {
          next: (v) => {
            if (v != null) {
              this.succesfullStep()
            }
          },
          error: (e) => {
            this.mapServiceValidationResponse((e.error != null && e.error != undefined) ? e.error.detail : 'ERROR')
          },
          complete: () => { }
        }
      )

  }

  succesfullStep() {
    sessionStorage.removeItem('register')
    this.router.navigate([Commons.PATH_LOGIN])
    this.openModal('label.request-sended', 'label.email-review', Commons.ICON_SUCCESS)
  }

  cancelAll() {
    sessionStorage.removeItem('register')
    this.router.navigate([Commons.PATH_LOGIN])
  }

  toTC() {
    this.openNewWindowWhithoutToken(Commons.PATH_TERMS + '/terms-conditions')
  }

  toPP() {
    this.openNewWindowWhithoutToken(Commons.PATH_TERMS + '/privacy-policy')
  }

  openNewWindowWhithoutToken(path: string) {
    Commons.openWithoutExternalToken(path)
  }

}
