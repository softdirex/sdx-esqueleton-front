import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { CustomersService } from 'src/app/services/customers.service';
import { AlertModalComponent } from 'src/app/shared/modals/alert-modal/alert-modal.component';
import { AlertLinkModalComponent } from 'src/app/shared/modals/alert-link-modal/alert-link-modal.component';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { Router } from '@angular/router';
import { OwnerConfig } from 'src/app/shared/interfaces/core/owner-config';
import { Commons } from 'src/app/shared/Commons';
import { ServiceResponse } from 'src/app/shared/interfaces/core/service-response';
import { environment } from 'src/environments/environment';
import { ReCaptchaV3Service } from 'ng-recaptcha';

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.css']
})
export class PasswordRecoveryComponent implements OnInit {

  form!: UntypedFormGroup;

  ownerDetail: OwnerConfig = Commons.emptyOwnerConfig()

  serviceResponse?: ServiceResponse

  STEP_INITIAL = 1
  STEP_LOADING = 2

  step = this.STEP_INITIAL

  alertModal: MdbModalRef<AlertModalComponent> | null = null;
  alertLinkModal: MdbModalRef<AlertLinkModalComponent> | null = null;

  loginPath: string = Commons.PATH_LOGIN
  registerPath: string = Commons.PATH_REGISTER
  PATH_TERMS = '/' + Commons.PATH_TERMS + '/' + Commons.TERM_CODES[0].code
  PATH_CONTACT = '/' + Commons.PATH_CONTACT
  reCAPTCHAToken: string = ''

  constructor(
    private customerService: CustomersService,
    private router: Router,
    private modalService: MdbModalService,
    private recaptchaV3Service: ReCaptchaV3Service
  ) { }

  ngOnInit(): void {
    this.ownerDetail = (Commons.getOwner() != null) ? Commons.getOwner().config : Commons.getDefaultConfig()
    this.form = new UntypedFormGroup({
      email: new UntypedFormControl('', [Validators.required, Validators.email])
    })
  }

  get email() { return this.form.get('email')!; }

  sendRequest(email: string) {
    this.recaptchaV3Service.execute('esqueleton_password_recovery').subscribe((token: string) => {
      this.reCAPTCHAToken = token
      this.step = this.STEP_LOADING
    this.customerService.sendPasswordRecoveryRequest(email)
      .subscribe({
        next: (v) => {
          this.router.navigate([Commons.PATH_LOGIN])
          this.openModal('label.request-sended', 'label.email-review', Commons.ICON_SUCCESS)
        },
        error: (e) => {
          if (e.error != null && e.error.detail != null) {
            switch (e.error.detail) {
              case 'Invalid email':
                this.router.navigate([Commons.PATH_LOGIN])
                this.openModal('validations.invalid-email', 'register.try-again-msg', Commons.ICON_WARNING)
                break
              case 'User not registered in this product':
                this.router.navigate([Commons.PATH_LOGIN])
                this.alertLinkModal = this.modalService.open(AlertLinkModalComponent, {
                  data: {
                    title: 'validations.emailinactive-inproduct',
                    message: 'register.try-in-ee-msg',
                    icon: Commons.ICON_WARNING,
                    linkName: 'label.go'
                  }
                })
                this.alertLinkModal.onClose.subscribe((accept: any) => {
                  if (accept) {
                    window.open(environment.coreFrontendEndpoint + 'password-recovery')
                  }
                });
                break
              case 'API_RESPONSE: The client has no active licenses':
                this.router.navigate([Commons.PATH_LOGIN])
                this.alertLinkModal = this.modalService.open(AlertLinkModalComponent, {
                  data: {
                    title: 'validations.licenceinactive-inproduct',
                    message: 'register.try-in-ee-msg',
                    icon: Commons.ICON_WARNING,
                    linkName: 'label.go'
                  }
                })
                this.alertLinkModal.onClose.subscribe((accept: any) => {
                  if (accept) {
                    window.open(environment.coreFrontendEndpoint + 'password-recovery')
                  }
                });
                break
              default:
                this.alertLinkModal = this.modalService.open(AlertLinkModalComponent, {
                  data: {
                    title: 'login.credentials-error',
                    message: 'login.recovery-invite',
                    icon: Commons.ICON_WARNING,
                    linkName: 'login.create-msg'
                  }
                })
                this.alertLinkModal.onClose.subscribe((accept: any) => {
                  if (accept) {
                    this.router.navigate([Commons.PATH_REGISTER])
                  }
                });
                break
            }
          } else {
            this.router.navigate([Commons.PATH_LOGIN])
            this.openModal('label.unknown-error', 'label.unknown-error-contact-retry', Commons.ICON_ERROR)
          }
        },
        complete: () => console.info('complete')
      }
      )
    })
  }

  return() {
    this.router.navigate([Commons.PATH_LOGIN])
  }

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'validations.required-email'
    }

    return this.email.hasError('email') ? 'validations.invalid-email' : '';
  }

  openModal(title: string, message: string, icon: string) {
    this.alertModal = this.modalService.open(AlertModalComponent, {
      data: { title: title, message: message, icon: icon },
    })
  }

}
