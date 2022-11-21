import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { CustomersService } from 'src/app/services/customers.service';
import { LanguageUtilService } from 'src/app/services/language-util.service';
import { Commons } from 'src/app/shared/Commons';
import { AlertModalComponent } from 'src/app/shared/modals/alert-modal/alert-modal.component';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {

  lang = ""
  id = 0
  sign = ""
  flow = ""

  FLOW_REGISTER = 'REGISTER'
  FLOW_REGISTER_SIGNED = 'REGISTER_SIGNED'

  alertModal: MdbModalRef<AlertModalComponent> | null = null;

  pwdRecoveryPath: string = Commons.PATH_PWD_REC
  loginPath: string = Commons.PATH_LOGIN

  getScreenWidth: any;
  mobileWidth: number = Commons.MOBILE_WIDTH

  constructor(
    private customerService: CustomersService,
    private route: ActivatedRoute,
    private langService: LanguageUtilService,
    private modalService: MdbModalService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getScreenWidth = window.innerWidth
    this.route.queryParams
      .subscribe(params => {
        this.langService.setLanguage(params['lang'])
        this.id = params['id']
        this.lang = params['lang']
        this.sign = params['sign']
        this.flow = params['flow']
      }
      );
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth
  }

  verify() {
    this.sendRequest(this.id, this.lang, this.sign)
  }

  openModal(title: string, message: string, icon: string) {
    this.alertModal = this.modalService.open(AlertModalComponent, {
      data: { title: title, message: message, icon: icon },
    })
  }

  sendRequest(id: number, lang: string, sign: string) {
    if (this.flow == undefined || this.flow == null) {
      this.flow = this.FLOW_REGISTER
    }
    if (id == 0 && sign == '') {
      this.router.navigate([Commons.PATH_LOGIN])
      this.openModal('label.unknown-error', 'label.unknown-error-contact-retry', Commons.ICON_ERROR)
    } else {
      this.customerService.postCustomerSigned(this.flow, id, lang, sign, null)
        .subscribe({
          next: (v) => {
            this.router.navigate([Commons.PATH_LOGIN])
            this.openModal('label.verify-success', 'label.verify-success-detail', Commons.ICON_SUCCESS)
          },
          error: (e) => {
            if (e.error != null && e.error.detail != null && e.error.detail == 'Email forwarded') {
              this.router.navigate([Commons.PATH_LOGIN])
              this.openModal('label.request-expired', 'label.email-review', Commons.ICON_WARNING)
            }
            this.router.navigate([Commons.PATH_LOGIN])
            this.openModal('label.unknown-error', 'label.unknown-error-contact-retry', Commons.ICON_ERROR)
          },
          complete: () => console.info('request complete')
        }
        )
    }

  }

}
