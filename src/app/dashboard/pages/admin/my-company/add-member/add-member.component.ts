import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { map, Observable, startWith } from 'rxjs';
import { CountriesService } from 'src/app/services/countries.service';
import { CustomersService } from 'src/app/services/customers.service';
import { LanguageUtilService } from 'src/app/services/language-util.service';
import { Commons } from 'src/app/shared/utils/commons';
import { Country } from 'src/app/shared/utils/interfaces/core/country';
import { CustomerRequest } from 'src/app/shared/utils/interfaces/core/customer-request';
import { PersonalData } from 'src/app/shared/utils/interfaces/core/personal-data';
import { PersonalDataRequest } from 'src/app/shared/utils/interfaces/core/personal-data-request';
import { AlertModalComponent } from 'src/app/shared/utils/modals/alert-modal/alert-modal.component';
import { NameFormatPipe } from 'src/app/shared/utils/pipes/name-format.pipe';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.scss']
})
export class AddMemberComponent implements OnInit {
  // Step validator
  currentStep?: number
  /* -BEGIN- Step Values */
  STEP_DOCUMENT_DATA = 1
  STEP_REGISTER = 3
  STEP_CUSTOMER = 4
  /* --END-- Step Values */
  /* -BEGIN- STEP_DOCUMENT_DATA Fields */
  documentDataTypes: any[] = Commons.DOCUMENT_DATA_TYPES
  fDocumentData!: FormGroup
  personalDataSession?: PersonalData
  optionsCountries: Country[] = [];
  filteredCountriesDocumentData: Observable<Country[]> | null = null
  /* --END-- STEP_DOCUMENT_DATA Fields */
  /* -BEGIN- STEP_REGISTER Fields */
  fPersonalData!: FormGroup
  pdReq?: PersonalDataRequest
  genderTypes: any[] = Commons.GENDER_TYPES
  provinceTypes: any[] = Commons.PROVINCE_TYPES
  filteredCountriesPersonalData: Observable<Country[]> | null = null
  maxYear: any = { year: (new Date().getFullYear()) - 14, month: 1, day: 1 }
  minYear: any = { year: (new Date().getFullYear()) - 80, month: 1, day: 1 }
  startYear: any = { year: (new Date().getFullYear()) - 33, month: 1, day: 1 };
  alertModal: MdbModalRef<AlertModalComponent> | null = null;
  emailConfirmationMessage?: string
  validNames: string | null = null
  /* --END-- STEP_REGISTER Fields */
  /* -BEGIN- STEP_CUSTOMER Fields */
  fCustomer: FormGroup
  customerRoles: any[] = Commons.USER_USU_ROLES
  /* --END-- STEP_CUSTOMER Fields */

  customersPath: string = Commons.PATH_CUSTOMERS
  session = Commons.sessionObject().customer
  modalTitle = 'label.adding-members'

  constructor(
    private countriesService: CountriesService,
    private customersService: CustomersService,
    private langService: LanguageUtilService,
    private modalService: MdbModalService,
    private router: Router,
    private nameFormat: NameFormatPipe
  ) { }

  ngOnInit(): void {
    /* -BEGIN- STEP_DOCUMENT_DATA Instances */
    var transientPDSession = sessionStorage.getItem('registerCBC')
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
        [Validators.required, Validators.pattern(environment.namesRegex)]),
      lastName: new FormControl(
        (this.personalDataSession != undefined && this.personalDataSession.last_name != null)
          ? this.personalDataSession.last_name : '',
        [Validators.required, Validators.pattern(environment.namesRegex)]),
      email: new FormControl(this.getContactDataFromSession('MAIL'), [Validators.required, Validators.email]),
      phone: new FormControl(this.getContactDataFromSession('PHONE'), [Validators.required, Validators.pattern(environment.phonesRegex)]),
      gender: new FormControl((this.personalDataSession != undefined && this.personalDataSession.sex != null)
        ? this.personalDataSession.sex + '' : '', [Validators.required]),
      birthday: new FormControl(
        (this.personalDataSession != undefined && this.personalDataSession.birthday != null)
          ? new Date(this.personalDataSession.birthday) : '', [Validators.required]),
      address: new FormControl((this.personalDataSession != undefined && this.personalDataSession.address != null)
        ? this.personalDataSession.address : '', [Validators.required, Validators.pattern(environment.addressRegex)]),
      provinceType: new FormControl(
        (this.personalDataSession != undefined && this.personalDataSession.province_type != null)
          ? this.personalDataSession.province_type : ''),
      provinceValue: new FormControl(
        (this.personalDataSession != undefined && this.personalDataSession.province_value != null)
          ? this.personalDataSession.province_value : '', [Validators.required]),
      city: new FormControl(
        (this.personalDataSession != undefined && this.personalDataSession.city != null)
          ? this.personalDataSession.city : '', [Validators.required, Validators.pattern(environment.namesRegex)]),
      country: new FormControl(
        (this.personalDataSession != undefined && this.personalDataSession.country != null)
          ? this.personalDataSession.country : '', [Validators.required, Validators.minLength(4), Validators.pattern(environment.namesRegex)])
    })

    this.filteredCountriesPersonalData = this.country.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filter(name as string) : this.optionsCountries.slice();
      }),
    );

    this.gender.setValidators([this.validGender(this.gender), Validators.required])
    //this.pwd2.addValidators(this.sameValue(this.pwd))
    this.provinceType.addValidators([this.validProvinceType(this.provinceType), Validators.required])
    /* --END-- STEP_REGISTER Instances */
    /* -BEGIN- STEP_CUSTOMER Instances */
    this.fCustomer = new FormGroup({
      cusEmail: new FormControl('', [Validators.required, Validators.email]),
      cusEmailConfirm: new FormControl('', [Validators.required, Validators.email]),
      cusRol: new FormControl('', [Validators.required]),
    })
    this.cusRol.addValidators([this.validUserRol(this.cusRol), Validators.required])
    /* --END-- STEP_CUSTOMER Instances */

    this.loadCountries()
    this.cusEmailConfirm.addValidators(this.sameEmailValue())
  }

  sameEmailValue(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null =>
      control.value === this.cusEmail.value
        ? null : { notSameEmail: control.value };
  }

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
    if (field.hasError('notSameEmail')) {
      return 'validations.notsame-email'
    }
    if (field.errors != null && field.errors.pattern != null &&
      field.errors.pattern.requiredPattern === environment.pwdRegex
    ) {
      return 'validations.invalid-pwd'
    }
    return field.hasError('pattern') ? 'validations.invalid-field' : undefined;
  }

  validGender(value1: AbstractControl): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null =>
      this.genderTypes.filter(option => option.value === value1.value).length == 1
        ? null : { validGender: control.value };
  }

  validProvinceType(value1: AbstractControl): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null =>
      this.provinceTypes.filter(option => option.value === value1.value).length == 1
        ? null : { validProvinceType: control.value };
  }

  validUserRol(value1: AbstractControl): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null =>
      this.customerRoles.filter(option => option.value === value1.value).length == 1
        ? null : { validUserRol: control.value };
  }

  validCountry(value1: AbstractControl): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null =>
      this.optionsCountries.filter(option => option.name === value1.value).length == 1
        ? null : { validCountry: control.value };
  }

  private _filter(name: string): Country[] {
    const filterValue = name.toLowerCase();

    return this.optionsCountries.filter(option => option.name.toLowerCase().includes(filterValue));
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
  get provinceType() { return this.fPersonalData.get('provinceType')!; }
  get provinceValue() { return this.fPersonalData.get('provinceValue')!; }
  get city() { return this.fPersonalData.get('city')!; }
  get country() { return this.fPersonalData.get('country')!; }
  get pwd() { return this.fPersonalData.get('pwd')!; }
  get pwd2() { return this.fPersonalData.get('pwd2')!; }
  get tcCheck() { return this.fPersonalData.get('tcCheck')!; }
  get ppCheck() { return this.fPersonalData.get('ppCheck')!; }
  /* --END-- STEP_REGISTER Get Controls */
  /* -BEGIN- STEP_CUSTOMER Get Controls */
  get cusEmail() { return this.fCustomer.get('cusEmail')!; }
  get cusEmailConfirm() { return this.fCustomer.get('cusEmailConfirm')!; }
  get cusRol() { return this.fCustomer.get('cusRol')!; }
  /* -BEGIN- STEP_CUSTOMER Get Controls */

  loadCountries() {
    this.countriesService.getAllCountries()
      .subscribe(
        {
          next: (v) => {
            if (Commons.validField(v) && Commons.validField(v.data)) {
              for (let cRs of v.data) {
                this.optionsCountries.push(cRs)
              }
              this.filteredCountriesDocumentData = this.docCountry.valueChanges.pipe(
                startWith(''),
                map(value => {
                  const name = typeof value === 'string' ? value : value?.name;
                  return name ? this._filter(name as string) : this.optionsCountries.slice();
                }),
              );
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

  onKeyValidatorCountry() {
    this.country.setValidators([this.validCountry(this.country), Validators.required])
  }

  onKeyValidatorDocCountry() {
    this.docCountry.setValidators([this.validCountry(this.docCountry), Validators.required])
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
      sessionStorage.setItem('registerCBC', JSON.stringify(this.personalDataSession))
    }


    this.customersService.getPersonalData(this.docType.value, this.docValue.value, this.docCountry.value)
      .subscribe({
        next: (v) => {
          if (v != null) {
            this.currentStep = this.STEP_CUSTOMER
            this.pdReq = v
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

  goStep(step: number) {
    this.currentStep = step
  }

  createPersonalData() {
    this.pdReq = {
      first_name: this.nameFormat.transform(this.name.value),
      last_name: this.nameFormat.transform(this.lastName.value),
      address: this.nameFormat.transform(this.address.value),
      city: this.nameFormat.transform(this.city.value),
      province_type: this.provinceType.value.toLowerCase(),
      province_value: this.nameFormat.transform(this.provinceValue.value),
      country: this.country.value,
      sex: Number.parseInt(this.gender.value),
      birthday: this.formatBirthdayDate(this.birthday.value),
      status: null,
      document_data: [
        {
          type: this.docType.value.toUpperCase(),
          value: this.docValue.value.toUpperCase(),
          country: this.docCountry.value
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
    this.cusEmail.setValue(this.email.value.toLowerCase())
    this.currentStep = this.STEP_CUSTOMER
  }

  createCustomer() {

    var validToRequest: boolean = true
    const customerRQ: CustomerRequest = {
      lang: this.langService.getLangActive(),
      email: this.cusEmail.value,
      status: (this.session.rol == Commons.USER_ROL_RWX) ? Commons.STATUS_ACTIVE : Commons.STATUS_INACTIVE,
      personal_data: this.pdReq,
      type: Commons.USER_TYPE_MEDIUM,
      rol: this.cusRol.value,
      avatar: Commons.DF_AVATAR,
      password: Commons.createPasswordForUser()
    }
    if (customerRQ.type == Commons.USER_TYPE_BASIC && customerRQ.rol != Commons.USER_ROL_BASIC) {
      validToRequest = false
      this.openModal('label.client-administration', 'label.client-no-basic', Commons.ICON_WARNING)
    }
    if (customerRQ.type == Commons.USER_TYPE_APP && customerRQ.rol != Commons.USER_ROL_S_RWX) {
      validToRequest = false
      this.openModal('label.client-administration', 'label.app-no-grant', Commons.ICON_WARNING)
    }
    if (validToRequest) {
      this.customersService.storeCustomersByCompany(this.session.company.id, customerRQ)
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
  }

  formatBirthdayDate(arg: any): string | null {

    if (Commons.validField(arg)) {
      var month = arg.month + ''
      var day = arg.day + ''
      return arg.year + '-' + month.padStart(2, '0') + '-' + day.padStart(2, '0')
    }
    return null
  }

  succesfullStep() {
    sessionStorage.removeItem('registerCBC')
    this.router.navigate([Commons.PATH_MY_COMPANY])
    this.openModal('label.request-sended', 'label.email-review-to-user', Commons.ICON_SUCCESS)
  }

  private mapServiceValidationResponse(detail: any) {
    detail = (detail != undefined && detail != null) ? detail : 'ERROR'
    switch (detail) {
      case 'Invalid country name':
        this.openModal('validations.invalid-country', 'validations.invalid-country-msg', Commons.ICON_WARNING)
        break;
      case 'The email entered is already in use':
        this.openModal(this.modalTitle, 'validations.email-used', Commons.ICON_WARNING)
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

  openModal(title: string, message: string, icon: string) {
    this.alertModal = this.modalService.open(AlertModalComponent, {
      data: { title: title, message: message, icon: icon },
    })
  }


}
