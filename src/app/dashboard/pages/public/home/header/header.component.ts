import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { OwnerConfig } from 'src/app/shared/interfaces/core/owner-config';
import { LanguageUtilService } from 'src/app/services/language-util.service';
import { OwnerConfigService } from 'src/app/services/owner-config.service';
import { SessionService } from 'src/app/services/session.service';
import { Commons } from 'src/app/shared/Commons';
import { SelectLanguageModalComponent } from 'src/app/shared/modals/select-language-modal/select-language-modal.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  ownerDetail: OwnerConfig = Commons.emptyOwnerConfig()

  PATH_ABOUT = '/'+Commons.PATH_ABOUT
  PATH_CONTACT = '/'+Commons.PATH_CONTACT
  PATH_MY_CUSTOMER = '/'+Commons.PATH_MY_CUSTOMER
  PATH_PRODUCT = '/'+Commons.PATH_PRODUCT
  PATH_LOGIN = '/'+Commons.PATH_LOGIN
  PATH_REGISTER = '/'+Commons.PATH_REGISTER

  getScreenWidth: any;
  mobileWidth: number = Commons.MOBILE_WIDTH
  sessionIsOpen: boolean = Commons.sessionIsOpen()
  sessionObject: any = Commons.sessionObject()
  selLangModal: MdbModalRef<SelectLanguageModalComponent> | null = null;

  constructor(
    private sessionService: SessionService,
    private router: Router,
    private ownerConfigService: OwnerConfigService,
    private modalService: MdbModalService,
    private langService: LanguageUtilService,
    ) { }

  ngOnInit(): void {
    this.loadOwnerConfig()
    this.getScreenWidth = window.innerWidth
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth
  }

  loadOwnerConfig(){
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

  closeSession() {
    if (Commons.sessionIsOpen()) {
      this.sessionService.setUserLoggedIn(false);
      Commons.sessionClose()
      this.router.navigate([Commons.PATH_MAIN]).then(() => {
        window.location.reload();
      });
    }
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

  getCustomerName() {
    let name = 'NO-NAME'
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

}
