import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { CustomersService } from 'src/app/services/customers.service';
import { LanguageUtilService } from 'src/app/services/language-util.service';
import { SessionService } from 'src/app/services/session.service';
import { Commons } from 'src/app/shared/Commons';
import { AlertModalComponent } from 'src/app/shared/modals/alert-modal/alert-modal.component';
import { SelectLanguageModalComponent } from 'src/app/shared/modals/select-language-modal/select-language-modal.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css']
})
export class AdminHeaderComponent implements OnInit {

  appName = environment.appName

  PATH_PRODUCT = Commons.PATH_PRODUCT
  PATH_MY_COMPANY = Commons.PATH_MY_COMPANY
  PATH_MY_PURCHASES = Commons.PATH_MY_PURCHASES
  PATH_MY_LICENCES = Commons.PATH_MY_LICENCES
  PATH_MAIN = Commons.PATH_MAIN
  PATH_MY_CUSTOMER = Commons.PATH_MY_CUSTOMER
  PATH_LOGIN = Commons.PATH_LOGIN

  PATH_CONFIG = Commons.PATH_CONFIG_WITH_LIC

  getScreenWidth: any;
  mobileWidth: number = Commons.MOBILE_WIDTH
  sessionIsOpen: boolean = Commons.sessionIsOpen()
  sessionObject: any = Commons.sessionObject()
  alertModal: MdbModalRef<AlertModalComponent> | null = null;
  title = 'label.access-link'
  selLangModal: MdbModalRef<SelectLanguageModalComponent> | null = null;


  constructor(
    private sessionService: SessionService,
    private router: Router,
    private modalService: MdbModalService,
    private langService: LanguageUtilService,
    private customersService: CustomersService
  ) { }

  ngOnInit(): void {
    this.getScreenWidth = window.innerWidth
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth
  }

  openLanguageModal() {
    this.selLangModal = this.modalService.open(SelectLanguageModalComponent)
    this.selLangModal.onClose.subscribe((lang: any) => {
      if (lang != this.langService.getLangActive()) {
        this.langService.setLanguage(lang)
        window.location.reload();
      }
    });
  }

  closeSession() {
    if (Commons.sessionIsOpen()) {
      this.sessionService.setUserLoggedIn(false);
      Commons.sessionClose()
      this.router.navigate([Commons.PATH_MAIN]).then(() => {
        window.location.reload();
      });
    }
  }

  getCustomerName() {
    var name = 'NO-NAME'
    if (this.sessionObject.customer) {
      name = this.sessionObject.customer.email
      if (this.sessionObject.customer.personal_data) {
        name = this.sessionObject.customer.personal_data.first_name
        if (this.sessionObject.customer.personal_data.last_name) {
          name = name + ' ' + this.sessionObject.customer.personal_data.last_name
        }
      }
    }
    return name
  }

  getCompanyName() {
    var name = 'NO-NAME'
    if (this.sessionObject.customer) {
      if (this.sessionObject.customer.company) {
        name = this.sessionObject.customer.company.name
      }
    }
    return name
  }

  get withoutCompany() {
    return !Commons.validField(Commons.sessionObject().customer.company)
  }

  toSupport() {
    this.openNewWindow(Commons.PATH_SUPPORT)
  }

  toMyCompany() {
    if(this.withoutCompany){
      this.customersService.loginCustomer(Commons.sessionObject().customer.email,Commons.sessionCredentials()).subscribe({
        next: (v) => {
          if (v != null) {
            Commons.sessionReloadCustomer(v)
            window.location.reload();
            this.openNewWindow(this.PATH_MY_COMPANY)
          }
        },
        error: (e) => {
          if (e.error != null && e.error.detail != null) {
            switch (e.error.detail) {
              case 'You must verify the email':
                this.openModal('login.button-tooltip', 'label.email-review', Commons.ICON_WARNING)
                break
              case 'User blocked':
                this.openModal('login.credentials-locked', 'login.locked-msg', Commons.ICON_WARNING)
                break
              default:
                this.openModal('label.unknown-error', 'label.unknown-error-contact-retry', Commons.ICON_ERROR)
                break
            }
          } else {
            this.openModal('label.unknown-error', 'label.unknown-error-contact-retry', Commons.ICON_ERROR)
          }
        },
        complete: () => { }
      })
    }else{
      this.openNewWindow(this.PATH_MY_COMPANY)
    }
  }

  toPurchases() {
    this.openNewWindow(this.PATH_MY_PURCHASES)
  }

  toLicences() {
    this.openNewWindow(this.PATH_MY_LICENCES)
  }

  openNewWindow(path: string) {
    Commons.openWithExternalToken(path)
  }

  openModalWithRedirection(title: string, message: string, icon: string, path: string) {
    this.alertModal = this.modalService.open(AlertModalComponent, {
      data: { title: title, message: message, icon: icon },
    })
    this.alertModal.onClose.subscribe(() => {
      Commons.openWithExternalToken(path)
    });
  }

  openModal(title: string, message: string, icon: string) {
    this.alertModal = this.modalService.open(AlertModalComponent, {
      data: { title: title, message: message, icon: icon },
    })
  }

}
