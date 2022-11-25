import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { OwnerConfig } from 'src/app/public/models/core/OwnerConfig';
import { OwnerConfigService } from 'src/app/services/owner-config.service';
import { Commons } from 'src/app/shared/Commons';
import { AlertModalComponent } from 'src/app/shared/modals/alert-modal/alert-modal.component';
import { NameFormatPipe } from 'src/app/shared/pipes/name-format.pipe';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  enableContactForm: boolean = false


  ownerDetail: OwnerConfig = {
    id: 0,
    company_name: '',
    owner_id: 0,
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
    lang: '',
    createdAt: null,
    updatedAt: null
  }

  form: FormGroup = new FormGroup({})

  PATH_ABOUT = '/' + Commons.PATH_ABOUT
  alertModal: MdbModalRef<AlertModalComponent> | null = null;

  constructor(
    private ownerConfigService: OwnerConfigService,
    private nameFormat: NameFormatPipe,
    private modalService: MdbModalService
  ) { }

  ngOnInit(): void {
    this.loadOwnerConfig()
    this.loadForm()
  }

  loadForm() {
    this.form = new FormGroup({
      first_name: new FormControl('', [Validators.required, Validators.pattern(environment.namesRegex)]),
      last_name: new FormControl('', [Validators.pattern(environment.namesRegex)]),
      phone: new FormControl('', [Validators.pattern(environment.phonesRegex)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      obs: new FormControl('', [Validators.pattern(environment.obsRegex)])
    })

  }

  /* -BEGIN- Get Controls */
  get first_name() { return this.form.get('first_name')!; }
  get last_name() { return this.form.get('last_name')!; }
  get phone() { return this.form.get('phone')!; }
  get email() { return this.form.get('email')!; }
  get obs() { return this.form.get('obs')!; }
  /* --END-- Get Controls */

  loadOwnerConfig() {
    const validated = Commons.getOwnerConfig()
    if (validated == null) {
      //load from endpoint
      this.ownerConfigService.getConfig().subscribe(
        {
          next: (v) => {
            this.ownerDetail = v
            Commons.setOwnerConfig(v)
          },
          complete: () => { }
        }
      )
    } else {
      this.ownerDetail = validated
    }
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
    if (field.errors != null && field.errors.pattern != null &&
      field.errors.pattern.requiredPattern === environment.pwdRegex
    ) {
      return 'validations.invalid-pwd'
    }

    return field.hasError('pattern') ? 'validations.invalid-field' : '';
  }

  enable() {
    this.enableContactForm = !this.enableContactForm
  }

  send() {
    this.enable()
    var names = this.nameFormat.transform(this.first_name.value)
    if (Commons.validField(this.last_name.value)) {
      names = names + ' ' + this.nameFormat.transform(this.last_name.value)
    }
    this.ownerConfigService.sendContactMail(
      this.ownerDetail.lang,
      names,
      this.phone.value,
      this.email.value,
      this.obs.value,
      this.ownerDetail.contact_mail
    ).subscribe(
      {
        next: (v) => {
          this.openModal('label.request-sended', 'label.contact-sended', Commons.ICON_SUCCESS)
        },
        error: (e) => {
          this.openModal('label.unknown-error', 'label.unknown-error-contact-retry', Commons.ICON_ERROR)
        },
        complete: () => { this.loadForm() }
      }
    )
  }

  openModal(title: string, message: string, icon: string) {
    this.alertModal = this.modalService.open(AlertModalComponent, {
      data: { title: title, message: message, icon: icon },
    })
  }

}
