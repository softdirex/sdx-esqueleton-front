import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { OwnerConfig } from 'src/app/shared/interfaces/core/owner-config';
import { LanguageUtilService } from 'src/app/services/language-util.service';
import { SessionService } from 'src/app/services/session.service';
import { Commons } from 'src/app/shared/Commons';
import { SelectLanguageModalComponent } from 'src/app/shared/modals/select-language-modal/select-language-modal.component';
import { CdkService } from 'src/app/services/cdk.service';
import { environment } from 'src/environments/environment';
import { CompaniesService } from 'src/app/services/companies.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  ownerDetail: OwnerConfig = Commons.emptyOwnerConfig()

  PATH_ABOUT = '/' + Commons.PATH_ABOUT
  PATH_CONTACT = '/' + Commons.PATH_CONTACT
  PATH_MY_CUSTOMER = '/' + Commons.PATH_MY_CUSTOMER
  PATH_PRODUCT = '/' + Commons.PATH_PRODUCT
  PATH_LOGIN = '/' + Commons.PATH_LOGIN
  PATH_REGISTER = '/' + Commons.PATH_REGISTER

  getScreenWidth: any;
  mobileWidth: number = Commons.MOBILE_WIDTH
  sessionIsOpen: boolean = Commons.sessionIsOpen()
  sessionObject: any = Commons.sessionObject()
  selLangModal: MdbModalRef<SelectLanguageModalComponent> | null = null;

  constructor(
    private sessionService: SessionService,
    private router: Router,
    private modalService: MdbModalService,
    private langService: LanguageUtilService,
    private cdkService: CdkService,
    private service: CompaniesService,
  ) { }

  ngOnInit(): void {
    this.loadOwnerConfig()
    this.getScreenWidth = window.innerWidth
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth
  }

  loadOwnerConfig() {
    const validated = Commons.getOwner()
    if (validated == null) {
      //load from endpoint
      if (environment.ownerId != 0) {
        this.service.getOwner(environment.ownerId + '').subscribe(
          {
            next: async (v) => {
              const owner = await this.cdkService.getTrxDec(v.trx)
              this.ownerDetail = owner.config
              Commons.setOwner(owner)
              window.location.reload();
            },
            error: () => {
              this.ownerDetail = Commons.getDefaultConfig()
            },
            complete: () => { }
          }
        )
      }
    } else {
      this.ownerDetail = validated.config
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
