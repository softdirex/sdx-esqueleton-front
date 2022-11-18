import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { LanguageUtilService } from 'src/app/services/language-util.service';
import { SessionService } from 'src/app/services/session.service';
import { StorageService } from 'src/app/services/storage.service';
import { Commons } from 'src/app/shared/Commons';
import { SelectLanguageModalComponent } from 'src/app/shared/modals/select-language-modal/select-language-modal.component';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}

export const MENU_ROUTES: RouteInfo[] = [
  { path: '/' + Commons.PATH_MAIN, title: 'label.store', icon: 'ni-bag-17 text-primary', class: '' },
  { path: '/' + Commons.PATH_PURCHASE, title: 'label.payments', icon: 'fa fa-money-bill text-yellow', class: '' }
];

export const PUBLIC_ROUTES: RouteInfo[] = [
  { path: '/' + Commons.PATH_MY_COMPANY, title: 'label.organization', icon: 'ni-building text-red', class: '' },
  { path: '/' + Commons.PATH_MY_LICENCES, title: 'label.subscriptions', icon: 'ni-basket text-orange', class: '' },
  { path: '/' + Commons.PATH_MY_PURCHASES, title: 'label.payment-history', icon: 'fa fa-receipt text-success', class: '' },
];

export const ADMIN_ROUTES: RouteInfo[] = [
  { path: '/' + Commons.PATH_MAIN, title: 'label.products', icon: 'ni-app text-primary', class: '' },
  { path: '/' + Commons.PATH_MAIN, title: 'label.plans', icon: 'fa fa-clipboard-check text-success', class: '' },
  { path: '/' + Commons.PATH_MAIN, title: 'label.licences', icon: 'ni-money-coins text-orange', class: '' },
  { path: '/' + Commons.PATH_MAIN, title: 'label.customers', icon: 'ni-single-02 text-yellow', class: '' },
  { path: '/' + Commons.PATH_MAIN, title: 'label.companies', icon: 'ni-building text-red', class: '' },
  { path: '/' + Commons.PATH_MAIN, title: 'label.sales-report', icon: 'fa fa-chart-line text-success', class: '' },
];

export const SETTINGS_ROUTES: RouteInfo[] = [
  { path: '/' + Commons.PATH_MY_CUSTOMER, title: 'label.profile', icon: 'ni-single-02 text-primary', class: '' }
];

export const ALL_ROUTES: RouteInfo[] = MENU_ROUTES.concat(PUBLIC_ROUTES.concat(ADMIN_ROUTES.concat(SETTINGS_ROUTES)))

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public menuItems: any[] = [];
  public publicItems: any[] = [];
  public adminItems: any[] = [];
  public settingsItems: any[] = [];
  public argonItems: any[] = [];

  public isCollapsed = true;

  loginPath: string = Commons.PATH_LOGIN
  profilePath: string = Commons.PATH_MY_CUSTOMER
  supportPath: string = Commons.PATH_SUPPORT
  mainPath: string = Commons.PATH_MAIN

  sessionIsOpen: boolean = Commons.sessionIsOpen()
  sessionObject: any = Commons.sessionObject()
  avatarUrl: any = Commons.DF_AVATAR
  isSuperUser: boolean = Commons.sessionIsSuperUser()
  langIcon: string = './assets/img/languages/LANG.png'

  selLangModal: MdbModalRef<SelectLanguageModalComponent> | null = null;

  constructor(
    private sessionService: SessionService,
    private router: Router,
    private storageService: StorageService,
    private sanitizer: DomSanitizer,
    private langService: LanguageUtilService,
    private modalService: MdbModalService,
  ) { }

  ngOnInit() {
    this.menuItems = MENU_ROUTES.filter(menuItem => menuItem);
    this.publicItems = PUBLIC_ROUTES.filter(publicItem => publicItem)
    this.adminItems = ADMIN_ROUTES.filter(adminItem => adminItem);
    this.settingsItems = SETTINGS_ROUTES.filter(settingItem => settingItem);
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
    });
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
}
