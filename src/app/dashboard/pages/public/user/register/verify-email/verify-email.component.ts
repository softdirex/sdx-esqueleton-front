import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { CustomersService } from 'src/app/services/customers.service';
import { LanguageUtilService } from 'src/app/services/language-util.service';
import { Commons } from 'src/app/shared/Commons';
import { TransientAuth } from 'src/app/shared/interfaces/core/transient-auth';
import { AlertModalComponent } from 'src/app/shared/modals/alert-modal/alert-modal.component';
import { ReCaptchaV3Service } from 'ng-recaptcha';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css'],
})
export class VerifyEmailComponent implements OnInit {
  transientData: TransientAuth = {
    token: '',
    flow: '',
    pwd: '',
    lang: '',
  };

  FLOW_REGISTER = 'REGISTER';

  alertModal: MdbModalRef<AlertModalComponent> | null = null;

  pwdRecoveryPath: string = Commons.PATH_PWD_REC;
  loginPath: string = Commons.PATH_LOGIN;

  getScreenWidth: any;
  mobileWidth: number = Commons.MOBILE_WIDTH;
  loading: boolean = false;
  reCAPTCHAToken: string = '';

  constructor(
    private customerService: CustomersService,
    private route: ActivatedRoute,
    private langService: LanguageUtilService,
    private modalService: MdbModalService,
    private router: Router,
    private recaptchaV3Service: ReCaptchaV3Service
  ) {}

  ngOnInit(): void {
    this.getScreenWidth = window.innerWidth;
    this.route.params.subscribe((params) => {
      this.langService.setLanguage(params['lang']);
      this.transientData.lang = params['lang'];
      this.transientData.token = params['transientAuth'];
    });
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
  }

  openModal(title: string, message: string, icon: string) {
    this.alertModal = this.modalService.open(AlertModalComponent, {
      data: { title: title, message: message, icon: icon },
    });
  }

  verify() {
    this.recaptchaV3Service
      .execute('esqueleton_verify_email')
      .subscribe((token: string) => {
        this.reCAPTCHAToken = token;
        this.transientData.flow = this.FLOW_REGISTER;
        if (
          !Commons.validField(this.transientData.token) &&
          this.transientData.token == ''
        ) {
          this.router.navigate([Commons.PATH_LOGIN]);
          this.openModal(
            'label.unknown-error',
            'label.unknown-error-contact-retry',
            Commons.ICON_ERROR
          );
        } else {
          this.loading = true;
          this.customerService
            .postCustomerSigned(this.transientData)
            .subscribe({
              next: (v) => {
                this.loading = false;
                this.router.navigate([Commons.PATH_LOGIN]);
                this.openModal(
                  'label.verify-success',
                  'label.verify-success-detail',
                  Commons.ICON_SUCCESS
                );
              },
              error: (e) => {
                this.loading = false;
                if (
                  e.error != null &&
                  e.error.detail != null &&
                  e.error.detail ==
                    'API_RESPONSE: Token not validated or expired'
                ) {
                  this.openModal(
                    'label.request-expired',
                    'label.email-review-expired-token',
                    Commons.ICON_WARNING
                  );
                } else {
                  if (
                    e.error != null &&
                    e.error.detail != null &&
                    e.error.detail == 'API_RESPONSE: Email forwarded'
                  ) {
                    this.openModal(
                      'label.request-expired',
                      'label.email-review',
                      Commons.ICON_WARNING
                    );
                  } else {
                    this.openModal(
                      'label.unknown-error',
                      'label.unknown-error-contact-retry',
                      Commons.ICON_ERROR
                    );
                  }
                }
                this.router.navigate([Commons.PATH_LOGIN]);
              },
              complete: () => console.info('request complete'),
            });
        }
      });
  }
}
