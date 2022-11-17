import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { CustomersService } from 'src/app/services/customers.service';
import { AlertModalComponent } from 'src/app/shared/modals/alert-modal/alert-modal.component';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { AlertLinkModalComponent } from 'src/app/shared/modals/alert-link-modal/alert-link-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionService } from 'src/app/services/session.service';
import { LanguageUtilService } from 'src/app/services/language-util.service';
import { Commons } from 'src/app/shared/Commons';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email = new FormControl('', [Validators.required, Validators.email]);
  pwd = new FormControl('', [Validators.required]);

  alertModal: MdbModalRef<AlertModalComponent> | null = null;
  alertLinkModal: MdbModalRef<AlertLinkModalComponent> | null = null;

  constructor(
    private customerService: CustomersService,
    private modalService: MdbModalService,
    private route: ActivatedRoute,
    private sessionService: SessionService,
    private router: Router,
    private langService: LanguageUtilService,
  ) { }

  ngOnInit(): void {
    if (Commons.sessionIsOpen()) {
      this.router.navigate([Commons.PATH_MAIN])
    }
    // Entrada por queryParams
    this.route.queryParams
      .subscribe(params => {
        const arg = params['arg']
        if (arg != undefined && arg == 'closed') {
          this.openModal('login.closed', 'login.closed-msg', Commons.ICON_WARNING)
        }
      }
      );
  }

  ngOnDestroy() {
  }

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'validations.required-email'
    }

    return this.email.hasError('email') ? 'validations.invalid-email' : '';

  }

  login() {
    const pwd = this.pwd.value
    if (pwd.length == 0) {
      this.openModal('login.credentials-error', 'login.recovery-invite', Commons.ICON_WARNING)
    } else {
      let credentials = Buffer.from(this.email.value + ':' + this.pwd.value).toString('base64');
      this.customerService.loginCustomer(this.email.value.toLowerCase(), credentials)
        .subscribe(
          {
            next: (v) => {
              if (v != null) {
                this.cleanForm()
                this.sessionService.setUserLoggedIn(true)
                this.langService.setLanguage(v.lang)
                Commons.sessionOpenCustomer(v, credentials)
                if (v.rol == Commons.USER_ROL_RWX && Commons.validField(v.company)) {
                  this.customerService.getIndexCustomersByCompany(
                    v.company.id,
                    Commons.USER_TYPE_MEDIUM,
                    Commons.STATUS_INACTIVE,
                    1,
                    1,
                    null
                  ).subscribe({
                    next: async (v) => {
                      if (v.meta.total > 0) {
                        this.alertLinkModal = this.modalService.open(AlertLinkModalComponent, {
                          data: {
                            title: 'label.welcome',
                            message: 'label.customers-inactive-alert',
                            icon: Commons.ICON_WARNING,
                            linkName: 'label.organization'
                          }
                        })
                        this.alertLinkModal.onClose.subscribe((accept: any) => {
                          if (accept) {
                            this.router.navigate([Commons.PATH_MY_COMPANY])
                          }
                        });
                      }
                    },
                    error: (e) => { },
                    complete: () => { }
                  })
                }
                this.router.navigate([Commons.PATH_MAIN])
              }
            },
            error: (e) => {
              if (e.error != null && e.error.detail != null) {
                switch (e.error.detail) {
                  case 'You must verify the email':
                    this.cleanForm()
                    this.openModal('login.button-tooltip', 'label.email-review', Commons.ICON_WARNING)
                    break
                  case 'User blocked':
                    this.cleanForm()
                    this.openModal('login.credentials-locked', 'login.locked-msg', Commons.ICON_WARNING)
                    break
                  default:
                    this.cleanPwd()
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
                this.openModal('label.unknown-error', 'label.unknown-error-contact-retry', Commons.ICON_ERROR)
              }
            },
            complete: () => { }
          }
        )
    }
    //this.router.navigate(['dashboard'])
  }

  openModal(title: string, message: string, icon: string) {
    this.alertModal = this.modalService.open(AlertModalComponent, {
      data: { title: title, message: message, icon: icon },
    })
  }

  cleanPwd() {
    this.pwd.setValue('')
  }

  cleanForm() {
    this.email.setValue('')
    this.pwd.setValue('')
  }

}
