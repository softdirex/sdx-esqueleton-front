import { Component, OnInit } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { OwnerConfig } from 'src/app/shared/interfaces/core/owner-config';
import { OwnerConfigService } from 'src/app/services/owner-config.service';
import { Commons } from 'src/app/shared/Commons';
import { AlertModalComponent } from 'src/app/shared/modals/alert-modal/alert-modal.component';
import { NameFormatPipe } from 'src/app/shared/pipes/name-format.pipe';
import { environment } from 'src/environments/environment';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { CdkService } from 'src/app/services/cdk.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent implements OnInit {
  ownerDetail: OwnerConfig = Commons.emptyOwnerConfig();

  form: UntypedFormGroup = new UntypedFormGroup({});

  PATH_ABOUT = '/' + Commons.PATH_ABOUT;
  alertModal: MdbModalRef<AlertModalComponent> | null = null;
  DF_LOGO = Commons.DF_PRODUCT_LOGO
  logoUrl: any = this.DF_LOGO
  loadingLogo: boolean = false
  loading: boolean = false
  reCAPTCHAToken: string = "";

  constructor(
    private ownerConfigService: OwnerConfigService,
    private nameFormat: NameFormatPipe,
    private modalService: MdbModalService,
    private recaptchaV3Service: ReCaptchaV3Service,
    private cdkService: CdkService,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
    this.ownerDetail = Commons.getDefaultConfig()
    this.logoUrl = this.sanitizer.bypassSecurityTrustUrl(this.DF_LOGO)
    this.loadForm();
  }

  loadForm() {
    this.form = new UntypedFormGroup({
      first_name: new UntypedFormControl('', [
        Validators.required,
        Validators.pattern(environment.namesRegex),
        Validators.maxLength(90),
        Validators.minLength(2),
      ]),
      last_name: new UntypedFormControl('', [
        Validators.pattern(environment.namesRegex),
        Validators.maxLength(90),
        Validators.minLength(2),
      ]),
      phone: new UntypedFormControl('', [
        Validators.pattern(environment.phonesRegex),
        Validators.maxLength(35),
        Validators.minLength(8),
      ]),
      email: new UntypedFormControl('', [
        Validators.required,
        Validators.email,
      ]),
      obs: new UntypedFormControl('', [
        Validators.pattern(environment.obsRegex),
        Validators.maxLength(255),
        Validators.minLength(8),
      ]),
    });
  }

  /* -BEGIN- Get Controls */
  get first_name() {
    return this.form.get('first_name')!;
  }
  get last_name() {
    return this.form.get('last_name')!;
  }
  get phone() {
    return this.form.get('phone')!;
  }
  get email() {
    return this.form.get('email')!;
  }
  get obs() {
    return this.form.get('obs')!;
  }
  /* --END-- Get Controls */

  getErrorMessage(field: any) {
    if (field.hasError('required')) {
      return 'validations.required-field';
    }
    if (field.hasError('validProvinceType')) {
      return 'validations.required-field';
    }
    if (field.hasError('validGender')) {
      return 'validations.required-field';
    }
    if (field.hasError('email')) {
      return 'validations.invalid-field';
    }
    if (field.hasError('notSame')) {
      return 'validations.notsame-pwd';
    }
    if (field.hasError('validCountry')) {
      return 'validations.invalid-country';
    }
    if (field.hasError('maxlength')) {
      return 'validations.maxlength';
    }
    if (field.hasError('minlength')) {
      return 'validations.minlength';
    }
    if (
      field.errors != null &&
      field.errors.pattern != null &&
      field.errors.pattern.requiredPattern === environment.pwdRegex
    ) {
      return 'validations.invalid-pwd';
    }

    return field.hasError('pattern') ? 'validations.invalid-field' : '';
  }

  send() {
    this.recaptchaV3Service
      .execute('esqueleton_contact')
      .subscribe(async (token: string) => {
        this.reCAPTCHAToken = token;
        let names = this.nameFormat.transform(this.first_name.value);
        if (Commons.validField(this.last_name.value)) {
          names = names + ' ' + this.nameFormat.transform(this.last_name.value);
        }
        this.loading = true
        const trxEnc = await this.cdkService.postTrxEnc(
          {
            host: 'https://' + window.location.hostname,
            subject: names + ' (' + this.email.value + ')',
            lang: this.ownerDetail.lang,
            names: names,
            phone: this.phone.value,
            email: this.email.value,
            obs: this.obs.value,
            receiver: this.ownerDetail.contact_mail
          })

        this.ownerConfigService.sendContactMail(trxEnc).subscribe({
          next: (v) => {
            this.loading = false;
            this.openModal(
              'label.request-sended',
              'label.contact-sended',
              Commons.ICON_SUCCESS
            );
          },
          error: (e) => {
            this.loading = false;
            this.openModal(
              'label.unknown-error',
              'label.unknown-error-contact-retry',
              Commons.ICON_ERROR
            );
          },
          complete: () => {
            this.loadForm();
          },
        });
      });
  }

  openModal(title: string, message: string, icon: string) {
    this.alertModal = this.modalService.open(AlertModalComponent, {
      data: { title: title, message: message, icon: icon },
    });
  }
}
