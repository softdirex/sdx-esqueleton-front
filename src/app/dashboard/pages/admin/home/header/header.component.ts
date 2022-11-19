import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { SessionService } from 'src/app/services/session.service';
import { Commons } from 'src/app/shared/Commons';
import { AlertModalComponent } from 'src/app/shared/modals/alert-modal/alert-modal.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  appName = environment.appName

  PATH_PRODUCT = Commons.PATH_PRODUCT
  PATH_MY_COMPANY = Commons.PATH_MY_COMPANY
  PATH_MY_PURCHASES = Commons.PATH_MY_PURCHASES
  PATH_MY_LICENCES = Commons.PATH_MY_LICENCES
  PATH_MAIN = Commons.PATH_MAIN
  PATH_MY_CUSTOMER = Commons.PATH_MY_CUSTOMER
  PATH_LOGIN = Commons.PATH_LOGIN

  getScreenWidth: any;
  mobileWidth: number = Commons.MOBILE_WIDTH
  sessionIsOpen: boolean = Commons.sessionIsOpen()
  sessionObject: any = Commons.sessionObject()
  alertModal: MdbModalRef<AlertModalComponent> | null = null;
  title = 'label.access-link'


  constructor(
    private sessionService: SessionService,
    private router: Router,
    private modalService: MdbModalService,
  ) { }

  ngOnInit(): void {
    this.getScreenWidth = window.innerWidth
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth
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

  getCompanyName(){
    var name = 'NO-NAME'
    if (this.sessionObject.customer) {
      if (this.sessionObject.customer.company) {
        name = this.sessionObject.customer.company.name
      }
    }
    return name
  }

  toSupport(){
    this.openNewWindow(Commons.PATH_SUPPORT)
  }

  toMyCompany(){
    this.openNewWindow(this.PATH_MY_COMPANY)
  }

  toPurchases(){
    this.openNewWindow(this.PATH_MY_PURCHASES)
  }

  toLicences(){
    this.openNewWindow(this.PATH_MY_LICENCES)
  }

  openNewWindow(path:string) {
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
