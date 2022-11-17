import { Component, HostListener, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { map, Observable, ReplaySubject, startWith } from 'rxjs';
import { CountriesService } from 'src/app/services/countries.service';
import { CustomersService } from 'src/app/services/customers.service';
import { LanguageUtilService } from 'src/app/services/language-util.service';
import { StorageService } from 'src/app/services/storage.service';
import { Commons } from 'src/app/shared/utils/commons';
import { Country } from 'src/app/shared/utils/interfaces/core/country';
import { Customer } from 'src/app/shared/utils/interfaces/core/customer';
import { PersonalData } from 'src/app/shared/utils/interfaces/core/personal-data';
import { AlertModalComponent } from 'src/app/shared/utils/modals/alert-modal/alert-modal.component';
import { ConfirmModalComponent } from 'src/app/shared/utils/modals/confirm-modal/confirm-modal.component';
import { LangItem } from 'src/app/shared/utils/modals/select-language-modal/select-language-modal.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  customer: Customer = {
    id: null,
    lang: '',
    email: '',
    avatar: '',
    email_verified_at: '',
    status: 0,
    personal_data: {
      id: 0,
      first_name: '',
      last_name: '',
      address: '',
      city: '',
      province_type: '',
      province_value: '',
      country: '',
      sex: 0,
      birthday: '1910-01-01',
      status: 0,
      created_at: '',
      updated_at: '',
      document_data: [],
      contact_data: [],
      customers: null,
    },
    type: '',
    rol: '',
    password: '',
    created_at: '',
    updated_at: '',
    company: {}
  }
  avatarFormValue: string
  avatarUrl: any
  form: FormGroup
  genderTypes: any[] = Commons.GENDER_TYPES
  provinceTypes: any[] = Commons.PROVINCE_TYPES

  alertModal: MdbModalRef<AlertModalComponent> | null = null;
  maxYear: any = { year: (new Date().getFullYear()) - 14, month: 1, day: 1 }
  minYear: any = { year: (new Date().getFullYear()) - 80, month: 1, day: 1 }
  startYear: any = { year: (new Date().getFullYear()) - 33, month: 1, day: 1 };

  filteredCountriesPersonalData: Observable<Country[]> | null = null
  optionsCountries: Country[] = [];
  model: any;
  customerTypes: any[] = Commons.USER_TYPES
  customerRoles: any[] = Commons.USER_ROLES

  cdForm: FormGroup
  getScreenWidth: any;
  mobileWidth: number = Commons.MOBILE_WIDTH

  contactTypeInSelect = Commons.CONTACT_DATAS
  confirmModal: MdbModalRef<ConfirmModalComponent> | null = null;
  modalTitle = 'label.my-profile'

  public files: any[] = [];
  logoFormValue: string = 'label.by-default'
  langItems: LangItem[] = [
    {
      code: 'en',
      icon: './assets/img/languages/en.png',
      label: 'language.en-name'
    }
  ]

  constructor(
    private service: CustomersService,
    private storageService: StorageService,
    private sanitizer: DomSanitizer,
    private modalService: MdbModalService,
    private router: Router,
    private langService: LanguageUtilService,
    private countriesService: CountriesService,
  ) { }

  ngOnInit() {
    this.langItems = new Array()
    for (let item of this.langService.getValidLanguages()) {
      if (item != this.langService.getLangActive()) {
        this.langItems.push({
          code: item,
          icon: './assets/img/languages/' + item + '.png',
          label: 'language.' + item + '-name'
        })
      }
    }
    if(!Commons.sessionIsOpen()){
      this.router.navigate([Commons.PATH_LOGIN])
    }
    const customer = Commons.sessionObject().customer
    if(customer.type == Commons.USER_TYPE_APP){
      this.openModal(this.modalTitle,'validations.wrong-privilege',Commons.ICON_WARNING)
      this.router.navigate([Commons.PATH_MAIN])
    }
    this.getScreenWidth = window.innerWidth
    this.loadForm()
    this.initCDForm()
      this.service.getMyCustomer().subscribe({
        next: async (v) => {
          this.customer = v
          if (v.avatar != Commons.DF_AVATAR) {
            this.avatarFormValue = 'label.loaded-by-file'
            this.storageService.getImage(v.avatar).subscribe(
              {
                next: async (v) => {
                  this.avatarUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(v))
                },
                error: (e) => {
                  this.avatarUrl = this.sanitizer.bypassSecurityTrustUrl(Commons.DF_AVATAR)
                },
                complete: () => { }
              }
            )
          } else {
            this.avatarUrl = this.sanitizer.bypassSecurityTrustUrl(Commons.DF_AVATAR)
          }
          this.loadForm()
        },
        error: (e) => {
          this.openModal('label.customer-detail', 'label.customer-not-found', Commons.ICON_WARNING)
          this.goBack()
        },
        complete: () => { }
      })


    this.filteredCountriesPersonalData = this.country.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filter(name as string) : this.optionsCountries.slice();
      }),
    );

    this.loadCountries()
    this.type.addValidators([this.validUserType(this.type), Validators.required])
    this.rol.addValidators([this.validUserRol(this.rol), Validators.required])
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth
  }

  loadForm() {
    this.form = new FormGroup({
      lang: new FormControl(this.customer.lang, [Validators.required]),
      email: new FormControl(this.customer.email, [Validators.required, Validators.email]),
      type: new FormControl(this.customer.type, [Validators.required]),
      rol: new FormControl(this.customer.rol, [Validators.required]),
      avatar: new FormControl(this.customer.avatar, [Validators.required]),
      first_name: new FormControl(this.personalData.first_name, [Validators.required, Validators.pattern(environment.namesRegex)]),
      last_name: new FormControl(this.personalData.last_name, [Validators.required, Validators.pattern(environment.namesRegex)]),
      address: new FormControl(this.personalData.address, [Validators.required, Validators.pattern(environment.addressRegex)]),
      city: new FormControl(this.personalData.city, [Validators.required, Validators.pattern(environment.namesRegex)]),
      provinceType: new FormControl(this.personalData.province_type, [Validators.required]),
      provinceValue: new FormControl(this.personalData.province_value, [Validators.required, Validators.pattern(environment.namesRegex)]),
      country: new FormControl(this.personalData.country, [Validators.required, Validators.pattern(environment.namesRegex)]),
      gender: new FormControl(this.personalData.sex, [Validators.required]),
      birthday: new FormControl(this.dateToForm(this.personalData.birthday), [Validators.required])
    })
    if (Commons.validField(this.personalData.contact_data) && this.personalData.contact_data.length > 0) {
      for (let item of this.personalData.contact_data) {
        for (let cdItem of this.contactTypeInSelect) {
          if (cdItem.field == item.type) {
            cdItem.value = item.value
            cdItem.enabled = true
          }
        }
      }
    }

  }

  initCDForm() {
    this.cdForm = new FormGroup({
      cdField: new FormControl('', [Validators.required]),
      cdValue: new FormControl('', [Validators.required])
    })
  }

  dateToForm(date: any) {
    const splitter = date.split('-', 3)
    var result = {
      year: Number(splitter[0]),
      month: Number(splitter[1]),
      day: Number(splitter[2])
    }
    return result
  }

  dateToJson(date: any) {
    if (Commons.validField(date)) {
      var month = date.month + ''
      var day = date.day + ''
      return date.year + '-' + month.padStart(2, '0') + '-' + day.padStart(2, '0')
    }
    return null
  }

  /* -BEGIN- STEP_REGISTER Get Controls */
  get lang() { return this.form.get('lang')!; }
  get email() { return this.form.get('email')!; }
  get type() { return this.form.get('type')!; }
  get rol() { return this.form.get('rol')!; }
  get avatar() { return this.form.get('avatar')!; }
  get first_name() { return this.form.get('first_name')!; }
  get last_name() { return this.form.get('last_name')!; }
  get gender() { return this.form.get('gender')!; }
  get birthday() { return this.form.get('birthday') as FormControl; }
  get address() { return this.form.get('address')!; }
  get provinceType() { return this.form.get('provinceType')!; }
  get provinceValue() { return this.form.get('provinceValue')!; }
  get city() { return this.form.get('city')!; }
  get country() { return this.form.get('country')!; }
  /* --END-- STEP_REGISTER Get Controls */

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

  validUserType(value1: AbstractControl): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null =>
      this.customerTypes.filter(option => option.value === value1.value).length == 1
        ? null : { validUserType: control.value };
  }

  validUserRol(value1: AbstractControl): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null =>
      this.customerRoles.filter(option => option === value1.value).length == 1
        ? null : { validUserRol: control.value };
  }

  validCountry(value1: AbstractControl): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null =>
      this.optionsCountries.filter(option => option.name === value1.value).length == 1
        ? null : { validCountry: control.value };
  }

  onKeyValidatorCountry() {
    this.country.setValidators([this.validCountry(this.country), Validators.required])
  }

  private _filter(name: string): Country[] {
    const filterValue = name.toLowerCase();

    return this.optionsCountries.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  getErrorMessage(field: any) {
    if (field != null) {
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

      return field.hasError('pattern') ? 'validations.invalid-field' : undefined;
    }

  }


  openModal(title: string, message: string, icon: string) {
    this.alertModal = this.modalService.open(AlertModalComponent, {
      data: { title: title, message: message, icon: icon },
    })
  }

  goBack() {
    this.router.navigate([Commons.PATH_MAIN])
  }

  get cusType() {
    return Commons.getCusType((Commons.validField(this.customer)) ? this.customer.type : '')
  }

  get cusRol() {
    return Commons.getCusRol((Commons.validField(this.customer)) ? this.customer.rol : '')
  }

  get companyName() {
    var companyName = this.langService.translate('label.basic-view')
    if (Commons.validField(this.customer) && Commons.validField(this.customer.id) && this.customer.id != 0) {
      companyName = this.langService.translate('label.customer-without-company')
    }
    if (Commons.validField(this.customer) && Commons.validField(this.customer.company)) {
      companyName = this.customer.company.name + ' - ' + this.customer.company.country
    }
    return companyName
  }

  get personalData(): PersonalData {
    return this.customer.personal_data
  }

  submit() {
    if (this.files[0] != undefined) {
      this.imageDimentionsValidToSend(this.files[0])
    } else {
      this.avatar.setValue(this.customer.avatar)
      this.editCustomer()
    }
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
              this.avatar.setValue(v.filename)
              this.editCustomer()
            }
          },
          error: (e) => { this.mapServiceValidationResponse((e.error != null && e.error != undefined) ? e.error.detail : 'ERROR') },
          complete: () => { }
        })
      }
    };
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

  editCustomer() {
    var validToRequest = true
    this.customer.lang = this.lang.value
    this.langService.setLanguage(this.lang.value)
    this.customer.type = this.type.value
    this.customer.rol = this.rol.value
    this.customer.email = this.email.value
    this.customer.avatar = this.avatar.value
    this.customer.personal_data.first_name = this.first_name.value
    this.customer.personal_data.last_name = this.last_name.value
    this.customer.personal_data.address = this.address.value
    this.customer.personal_data.city = this.city.value
    this.customer.personal_data.province_type = this.provinceType.value
    this.customer.personal_data.province_value = this.provinceValue.value
    this.customer.personal_data.country = this.country.value
    this.customer.personal_data.sex = this.gender.value
    this.customer.personal_data.birthday = this.dateToJson(this.birthday.value)
    this.customer.personal_data.sex = this.gender.value
    var contact_data = []
    for (let cdItem of this.contactTypeInSelect) {
      if (cdItem.enabled) {
        contact_data.push({
          type: cdItem.field,
          value: cdItem.value
        })
      }
    }
    this.customer.personal_data.contact_data = contact_data
    if (validToRequest) {
      this.service.updateMyCustomer(this.customer.id,this.customer)
        .subscribe(
          {
            next: (v) => {
              if (v != null) {
                Commons.sessionReloadCustomer(v)
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

  private mapServiceValidationResponse(detail: any) {
    detail = (detail != undefined && detail != null) ? detail : 'ERROR'
    switch (detail) {
      case 'Invalid country name':
        this.openModal('validations.invalid-country', 'validations.invalid-country-msg', Commons.ICON_WARNING)
        break;
      case 'The email entered is already in use':
        this.openModal('validations.email-used', 'register.other-email', Commons.ICON_WARNING)
        break;
      case 'Wrong names to merge record or Document Data already exists in another PersonalData':
        this.openModal(this.modalTitle, 'label.customer-edit-wrong-names-or-personaldata', Commons.ICON_ERROR)
        break;
      default:
        this.openModal('label.unknown-error', 'label.unknown-error-contact-retry', Commons.ICON_ERROR)
        break;
    }
    if (detail.startsWith('valid_names[')) {
      const validNames = detail.replace('valid_names[', '').replace(']', '')
      this.openModal('validations.invalid-country-msg', validNames, Commons.ICON_WARNING)
    }
  }

  succesfullStep() {
    this.alertModal = this.modalService.open(AlertModalComponent, {
      data: {
        title: this.modalTitle,
        message: 'label.customer-updated',
        icon: Commons.ICON_SUCCESS
      },
    })
    this.alertModal.onClose.subscribe(() => {
      window.location.reload()
    })
    
  }

  applyCDForm() {
    const field = this.cdField.value
    const fieldValue = this.cdValue.value

    var valid = true
    var regexp = new RegExp(environment.rrssRegex)
    if (field.startsWith('PHONE')) {
      regexp = new RegExp(environment.phonesRegex)
      valid = regexp.test(fieldValue);
    } else {
      const text = fieldValue
      if (text.length > 90) {
        valid = false
      } else {
        for (let i = 0; i < text.length; i++) {
          const character = text.charAt(i);
          if (valid) {
            valid = regexp.test(character);
          }
        }
      }
    }
    if (valid) {
      for (let item of this.contactTypeInSelect) {
        if (item.field == field) {
          item.value = fieldValue
          item.enabled = true
        }
      }
      this.initCDForm()
    } else {
      this.openModal('label.customer-detail', 'validations.invalid-field', Commons.ICON_WARNING)
      this.initCDForm()
    }

  }

  removeCDFormField(field: string) {
    this.confirmModal = this.modalService.open(ConfirmModalComponent, {
      data: { title: 'label.customer-detail', message: 'label.contact-data-remove', icon: Commons.ICON_WARNING },
    })
    this.confirmModal.onClose.subscribe((accept: any) => {
      if (accept) {
        for (let item of this.contactTypeInSelect) {
          if (item.field == field) {
            item.value = ''
            item.enabled = false
          }
        }
        this.initCDForm()
      }
    });
  }

  get cdField() { return this.cdForm.get('cdField')!; }
  get cdValue() { return this.cdForm.get('cdValue')!; }

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
    this.avatarUrl = this.sanitizer.bypassSecurityTrustUrl(Commons.DF_AVATAR)
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
        this.avatarUrl = this.sanitizer.bypassSecurityTrustUrl(img.src)
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

  get provinceTypeSelected(){
    const type = this.provinceTypes.find(item => item.value == this.provinceType.value)
    if (type == undefined) {
      return this.provinceTypes[0].name
    }
    return type.name
  }
}
