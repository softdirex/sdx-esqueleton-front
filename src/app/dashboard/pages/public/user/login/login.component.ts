import { Component, HostListener, OnInit } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { CustomersService } from 'src/app/services/customers.service';
import { AlertModalComponent } from 'src/app/shared/modals/alert-modal/alert-modal.component';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { AlertLinkModalComponent } from 'src/app/shared/modals/alert-link-modal/alert-link-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionService } from 'src/app/services/session.service';
import { LanguageUtilService } from 'src/app/services/language-util.service';
import { Commons } from 'src/app/shared/Commons';
import { ReCaptchaV3Service } from 'ng-recaptcha';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  email = new UntypedFormControl('', [Validators.required, Validators.email]);
  pwd = new UntypedFormControl('', [Validators.required]);

  linkRecoveryPw = Commons.PATH_PWD_REC;
  linkRegister = Commons.PATH_REGISTER;

  alertModal: MdbModalRef<AlertModalComponent> | null = null;
  alertLinkModal: MdbModalRef<AlertLinkModalComponent> | null = null;

  getScreenWidth: any;
  mobileWidth: number = Commons.MOBILE_WIDTH;
  loading: boolean = false;
  reCAPTCHAToken: string = '';

  constructor(
    private customerService: CustomersService,
    private modalService: MdbModalService,
    private route: ActivatedRoute,
    private sessionService: SessionService,
    private router: Router,
    private langService: LanguageUtilService,
    private recaptchaV3Service: ReCaptchaV3Service
  ) {}

  ngOnInit(): void {
    this.getScreenWidth = window.innerWidth;
    if (Commons.sessionIsOpen()) {
      this.router.navigate([Commons.PATH_MAIN]);
    }
    // Entrada por queryParams
    this.route.queryParams.subscribe((params) => {
      const arg = params['arg'];
      if (arg != undefined && arg == 'closed') {
        this.openModal(
          'login.closed',
          'login.closed-msg',
          Commons.ICON_WARNING
        );
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
  }

  ngOnDestroy() {}

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'validations.required-email';
    }

    return this.email.hasError('email') ? 'validations.invalid-email' : '';
  }

  login() {
    this.recaptchaV3Service
      .execute('esqueleton_login')
      .subscribe((token: string) => {
        this.reCAPTCHAToken = token;
        const pwd = this.pwd.value;
        if (pwd.length == 0) {
          this.openModal(
            'login.credentials-error',
            'login.recovery-invite',
            Commons.ICON_WARNING
          );
        } else {
          let credentials = window.btoa(
            this.email.value + ':' + this.pwd.value
          );
          this.loading = true;
          this.customerService
            .loginCustomer(this.email.value.toLowerCase(), credentials)
            .subscribe({
              next: (v) => {
                this.loading = false;
                if (v != null) {
                  this.cleanForm();
                  this.sessionService.setUserLoggedIn(true);
                  this.langService.setLanguage(v.lang);
                  Commons.sessionOpenCustomer(v, credentials);
                  window.location.reload();
                  this.router.navigate([Commons.PATH_MAIN]);
                }
              },
              error: (e) => {
                this.loading = false;
                if (e.error != null && e.error.detail != null) {
                  switch (e.error.detail) {
                    case 'You must verify the email':
                      this.cleanForm();
                      this.openModal(
                        'login.button-tooltip',
                        'label.email-review',
                        Commons.ICON_WARNING
                      );
                      break;
                    case 'User blocked':
                      this.cleanForm();
                      this.openModal(
                        'login.credentials-locked',
                        'login.locked-msg',
                        Commons.ICON_WARNING
                      );
                      break;
                    case 'This user does not belong to the organization':
                      this.cleanForm();
                      this.openModal(
                        'login.credentials-locked',
                        'login.organization-wrong-msg',
                        Commons.ICON_WARNING
                      );
                      break;
                    default:
                      this.cleanPwd();
                      this.alertLinkModal = this.modalService.open(
                        AlertLinkModalComponent,
                        {
                          data: {
                            title: 'login.credentials-error',
                            message: 'login.recovery-invite',
                            icon: Commons.ICON_WARNING,
                            linkName: 'login.create-msg',
                          },
                        }
                      );
                      this.alertLinkModal.onClose.subscribe((accept: any) => {
                        if (accept) {
                          this.router.navigate([Commons.PATH_REGISTER]);
                        }
                      });
                      break;
                  }
                } else {
                  this.openModal(
                    'label.unknown-error',
                    'label.unknown-error-contact-retry',
                    Commons.ICON_ERROR
                  );
                }
              },
              complete: () => {},
            });
        }
      });
  }

  openModal(title: string, message: string, icon: string) {
    this.alertModal = this.modalService.open(AlertModalComponent, {
      data: { title: title, message: message, icon: icon },
    });
  }

  cleanPwd() {
    this.pwd.setValue('');
  }

  cleanForm() {
    this.email.setValue('');
    this.pwd.setValue('');
  }
}
