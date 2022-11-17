import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { LanguageUtilService } from 'src/app/services/language-util.service';
import { Commons } from 'src/app/shared/utils/commons';
import { SelectLanguageModalComponent } from 'src/app/shared/utils/modals/select-language-modal/select-language-modal.component';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss']
})
export class AuthLayoutComponent implements OnInit, OnDestroy {
  anio: Date = new Date();
  public isCollapsed = true;

  ciaName: string = Commons.SDX
  mainPath: string = Commons.PATH_MAIN
  registerPath: string = Commons.PATH_REGISTER
  selLangModal: MdbModalRef<SelectLanguageModalComponent> | null = null;
  privacyPolicyPath:string = Commons.PATH_TERMS + '/' + Commons.TERM_CODES[0].code
  aboutPath: string = Commons.PATH_ABOUT
  supportPath: string = Commons.PATH_SUPPORT
  loginPath: string = Commons.PATH_LOGIN

  constructor(
    private router: Router,
    private langService: LanguageUtilService,
    private modalService: MdbModalService,
  ) { }

  ngOnInit() {
    var html = document.getElementsByTagName("html")[0];
    html.classList.add("auth-layout");
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("bg-default");
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
    });
  }
  ngOnDestroy() {
    var html = document.getElementsByTagName("html")[0];
    html.classList.remove("auth-layout");
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("bg-default");
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
