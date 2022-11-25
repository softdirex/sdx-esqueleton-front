import { Component, HostListener, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { map, Observable, startWith } from 'rxjs';
import { CompaniesService } from 'src/app/services/companies.service';
import { CountriesService } from 'src/app/services/countries.service';
import { LanguageUtilService } from 'src/app/services/language-util.service';
import { Commons } from 'src/app/shared/Commons';
import { Country } from 'src/app/shared/interfaces/core/country';
import { OwnerConfig } from 'src/app/shared/interfaces/core/owner-config';
import { AlertModalComponent } from 'src/app/shared/modals/alert-modal/alert-modal.component';
import { ConfirmModalComponent } from 'src/app/shared/modals/confirm-modal/confirm-modal.component';
import { LangItem } from 'src/app/shared/modals/select-language-modal/select-language-modal.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit {

  resource: OwnerConfig = {
    company_name: '',
    slogan: '',
    about: '',
    mission: '',
    vision: '',
    contact_phone: '',
    contact_mail: '',
    address: '',
    city: '',
    country: '',
    terms_filename: '',
    lang: 'en',
  }

  form: FormGroup = new FormGroup({})

  alertModal: MdbModalRef<AlertModalComponent> | null = null;
  filteredCountries: Observable<Country[]> | null = null
  optionsCountries: Country[] = [];
  model: any;
  getScreenWidth: any;
  mobileWidth: number = Commons.MOBILE_WIDTH
  confirmModal: MdbModalRef<ConfirmModalComponent> | null = null;
  modalTitle = 'label.configuration'
  langItems: LangItem[] = [
    {
      code: 'en',
      icon: './assets/img/languages/en.png',
      label: 'language.en-name'
    }
  ]
  PATH_PRODUCT = Commons.PATH_PRODUCT

  constructor(
    private service: CompaniesService,
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
    if (!Commons.sessionIsOpen()) {
      this.router.navigate([Commons.PATH_LOGIN])
    }
    const customer = Commons.sessionObject().customer

    if (customer.rol != Commons.USER_ROL_RWX) {
      this.openModal(this.modalTitle, 'validations.wrong-privilege', Commons.ICON_WARNING)
      this.router.navigate([Commons.PATH_MAIN])
    }
    this.getScreenWidth = window.innerWidth
    this.resource = Commons.sessionObject().customer.owner.config
    this.loadForm()


    this.loadCountries()
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth
  }

  loadForm() {
    this.form = new FormGroup({
      company_name: new FormControl(this.resource.company_name, [Validators.required, Validators.pattern(environment.namesRegex), Validators.maxLength(90), Validators.minLength(2)]),
      slogan: new FormControl(this.resource.slogan, [Validators.required, Validators.pattern(environment.obsRegex), Validators.maxLength(1000), Validators.minLength(20)]),
      about: new FormControl(this.resource.about.replace(/<br>/gi, '\n'), [Validators.required, Validators.pattern(environment.aboutRegex), Validators.maxLength(5000), Validators.minLength(20)]),
      mission: new FormControl(this.resource.mission.replace(/<br>/gi, '\n'), [Validators.required, Validators.pattern(environment.aboutRegex), Validators.maxLength(5000), Validators.minLength(20)]),
      vision: new FormControl(this.resource.vision.replace(/<br>/gi, '\n'), [Validators.required, Validators.pattern(environment.aboutRegex), Validators.maxLength(5000), Validators.minLength(20)]),
      contact_phone: new FormControl(this.resource.contact_phone, [Validators.pattern(environment.phonesRegex), Validators.maxLength(35), Validators.minLength(8)]),
      contact_mail: new FormControl(this.resource.contact_mail, [Validators.required, Validators.email]),
      address: new FormControl(this.resource.address, [Validators.pattern(environment.addressRegex), Validators.maxLength(90), Validators.minLength(2)]),
      country: new FormControl(this.resource.country, [Validators.required, Validators.pattern(environment.addressRegex), Validators.maxLength(90), Validators.minLength(2)]),
      city: new FormControl(this.resource.city, [Validators.required, Validators.pattern(environment.namesRegex), Validators.maxLength(90), Validators.minLength(2)]),
      terms_filename: new FormControl(this.resource.terms_filename, [Validators.required]),
      lang: new FormControl(this.resource.lang, [Validators.required, Validators.pattern(environment.namesRegex), Validators.maxLength(90), Validators.minLength(2)]),
    })

    this.filteredCountries = this.country.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filter(name as string) : this.optionsCountries.slice();
      }),
    );

  }

  /* -BEGIN- Get Controls */
  get company_name() { return this.form.get('company_name')!; }
  get slogan() { return this.form.get('slogan')!; }
  get about() { return this.form.get('about')!; }
  get mission() { return this.form.get('mission')!; }
  get vision() { return this.form.get('vision')!; }
  get contact_phone() { return this.form.get('contact_phone')!; }
  get contact_mail() { return this.form.get('contact_mail')!; }
  get address() { return this.form.get('address')!; }
  get city() { return this.form.get('city')!; }
  get country() { return this.form.get('country')!; }
  get terms_filename() { return this.form.get('terms_filename')!; }
  get lang() { return this.form.get('lang')!; }
  /* --END-- Get Controls */

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

  getErrorMessage(field: any): any {
    if(this.about.errors){
      console.log(this.about.errors)
    }
    if (field != null) {
      if (field.hasError('required')) {
        return 'validations.required-field'
      }
      if (field.hasError('maxlength')) {
        return 'validations.maxlength'
      }
      if (field.hasError('minlength')) {
        return 'validations.minlength'
      }
      if (field.hasError('email')) {
        return 'validations.invalid-field'
      }
      if (field.hasError('validCountry')) {
        return 'validations.invalid-country'
      }
      return field.hasError('pattern') ? 'validations.invalid-field' : null;
    }
    return null
  }


  openModal(title: string, message: string, icon: string) {
    this.alertModal = this.modalService.open(AlertModalComponent, {
      data: { title: title, message: message, icon: icon },
    })
  }

  goBack() {
    this.router.navigate([Commons.PATH_MAIN])
  }


  submit() {
    this.resource.company_name = this.company_name.value
    this.resource.slogan = this.slogan.value
    this.resource.about = this.about.value.replace(/\n/gi, '<br>')
    this.resource.mission = this.mission.value.replace(/\n/gi, '<br>')
    this.resource.vision = this.vision.value.replace(/\n/gi, '<br>')
    this.resource.contact_phone = this.contact_phone.value
    this.resource.contact_mail = this.contact_mail.value
    this.resource.address = this.address.value
    this.resource.city = this.city.value
    this.resource.country = this.country.value
    this.resource.terms_filename = this.terms_filename.value
    this.resource.lang = this.lang.value

    this.service.updateConfig(this.resource)
      .subscribe(
        {
          next: (v) => {
            if (v != null) {
              const customer = Commons.sessionObject().customer
              customer.owner.config = v
              Commons.sessionReloadCustomer(customer)
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


  private mapServiceValidationResponse(detail: any) {
    detail = (detail != undefined && detail != null) ? detail : 'ERROR'
    detail = detail.replace('API_RESPONSE: ', '')
    switch (detail) {
      case 'Invalid country name':
        this.openModal('validations.invalid-country', 'validations.invalid-country-msg', Commons.ICON_WARNING)
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
        message: 'label.configuration-updated',
        icon: Commons.ICON_SUCCESS
      },
    })
    this.alertModal.onClose.subscribe(() => {
      window.location.reload()
    })

  }

  labelSelectedLang(code: string): string {
    return 'language.' + code.toLocaleLowerCase() + '-name'
  }

}
