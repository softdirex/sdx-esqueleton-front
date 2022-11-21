import { Injectable } from '@angular/core';
import { TranslocoService, getBrowserLang } from '@ngneat/transloco';

@Injectable({
  providedIn: 'root'
})
export class LanguageUtilService {

  lang?: string

  languages = ['es','en','de','it','pt']

  constructor(private translocoService: TranslocoService) {
    this.lang = getBrowserLang();
    
    if(sessionStorage.getItem('lang')?.toString() != undefined && sessionStorage.getItem('lang')?.toString()!=null){
      this.lang = sessionStorage.getItem('lang')?.toString()
    }
    if (this.lang == undefined) {
      this.lang = this.translocoService.getActiveLang()
    }
    this.translocoService.setActiveLang(this.lang)
  }

  translate(arg: string) {
    return this.translocoService.translate(arg)
  }

  getLangActive() {
    return this.translocoService.getActiveLang() 
  }

  getValidLanguages() {
    return this.languages 
  }

  setLanguage(arg:string){
    const vLang = this.languages.find(lang => lang === arg.toLocaleLowerCase())
    console.log(vLang)
    if(vLang != undefined && vLang != null){
      console.log('SERTTTING LAMNG'+this.translocoService.getActiveLang())
      sessionStorage.setItem('lang',vLang)
      this.translocoService.setDefaultLang(vLang)
      this.translocoService.setActiveLang(vLang)
      console.log('SERTTTING LAMNG'+this.translocoService.getActiveLang())
      console.log('SERTTTING LAMNG'+this.translocoService.getAvailableLangs())
    }
  }
}
