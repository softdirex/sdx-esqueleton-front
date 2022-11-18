import { Component, OnInit } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { LanguageUtilService } from 'src/app/services/language-util.service';
import { Commons } from '../../Commons';

export interface LangItem {
  code: string
  icon: string
  label: string
}

@Component({
  selector: 'app-select-language-modal',
  templateUrl: './select-language-modal.component.html',
  styleUrls: ['./select-language-modal.component.css']
})
export class SelectLanguageModalComponent implements OnInit {
  languages: LangItem[] = [
    {
      code: 'en',
      icon: './assets/img/languages/en.png',
      label: 'language.en-name'
    }
  ]
  icon: string = Commons.ICON_WARNING

  constructor(
    public modalRef: MdbModalRef<SelectLanguageModalComponent>,
    private langServ: LanguageUtilService
  ) { }

  ngOnInit(): void {

    this.languages = new Array()
    for (let item of this.langServ.getValidLanguages()) {
      if (item != this.langServ.getLangActive()) {
        this.languages.push({
          code: item,
          icon: './assets/img/languages/' + item + '.png',
          label: 'language.' + item + '-name'
        })
      }
    }
  }

  setLang(arg: string): void {
    this.modalRef.close(arg)
  }

  cancel(): void {
    this.modalRef.close(this.langServ.getLangActive())
  }

}
