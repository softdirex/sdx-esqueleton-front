import { Component, OnInit } from '@angular/core';
import { ALL_ROUTES } from '../sidebar/sidebar.component';
import { Location } from '@angular/common';
import { Commons } from 'src/app/shared/utils/commons';
import { SessionService } from 'src/app/services/session.service';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { DomSanitizer } from '@angular/platform-browser';
import { LanguageUtilService } from 'src/app/services/language-util.service';
import { SelectLanguageModalComponent } from 'src/app/shared/utils/modals/select-language-modal/select-language-modal.component';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  public focus;
  public listTitles: any[];
  public location: Location;

  loginPath: string = Commons.PATH_LOGIN
  profilePath: string = Commons.PATH_MY_CUSTOMER
  supportPath: string = Commons.PATH_SUPPORT
  mainPath: string = Commons.PATH_MAIN

  sessionIsOpen: boolean = Commons.sessionIsOpen()
  sessionObject: any = Commons.sessionObject()
  avatarUrl: any = Commons.DF_AVATAR
  langIcon: string = './assets/img/languages/LANG.png'

  selLangModal: MdbModalRef<SelectLanguageModalComponent> | null = null;

  constructor(
    location: Location,
    private sessionService: SessionService,
    private router: Router,
    private storageService: StorageService,
    private sanitizer: DomSanitizer,
    private langService: LanguageUtilService,
    private modalService: MdbModalService,
  ) {
    this.location = location;
  }

  ngOnInit() {
    this.listTitles = ALL_ROUTES.filter(listTitle => listTitle);
    this.langIcon = this.langIcon.replace('LANG', this.langService.getLangActive())

    if (this.sessionIsOpen) {
      this.storageService.getImage(this.sessionObject.customer.avatar).subscribe(
        {
          next: async (v) => {
            this.avatarUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(v))
          },
          error: (e) => {
            this.avatarUrl = this.sanitizer.bypassSecurityTrustUrl(Commons.DF_AVATAR)
          },
          complete: () => { }
        }
      )
    }
  }

  getTitle() {
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === '#') {
      titlee = titlee.slice(1);
    }

    for (var item = 0; item < this.listTitles.length; item++) {
      if (this.listTitles[item].path === titlee) {
        return this.listTitles[item].title;
      }
    }
    return '';
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

}
